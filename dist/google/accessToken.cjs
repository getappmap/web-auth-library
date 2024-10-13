"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAccessToken = getAccessToken;
var _jose = require("jose");
var _env = require("../core/env.cjs");
var _error = require("../core/error.cjs");
var _utils = require("../core/utils.cjs");
var _credentials = require("./credentials.cjs");
var _customToken = require("./customToken.cjs");
/* SPDX-FileCopyrightText: 2022-present Kriasoft */
/* SPDX-License-Identifier: MIT */

const defaultCache = new Map();
/**
 * Fetches an access token from Google Cloud API using the provided
 * service account credentials.
 *
 * @throws {FetchError} — If the access token could not be fetched.
 */
async function getAccessToken(options) {
  if (!options?.waitUntil && _env.canUseDefaultCache) {
    (0, _utils.logOnce)("warn", "verifyIdToken", "Missing `waitUntil` option.");
  }
  let credentials;
  // Normalize service account credentials
  // using env.GOOGLE_CLOUD_CREDENTIALS as a fallback
  if (options?.credentials) {
    credentials = (0, _credentials.getCredentials)(options.credentials);
  } else {
    if (!options?.env?.GOOGLE_CLOUD_CREDENTIALS) {
      throw new TypeError("Missing credentials");
    }
    credentials = (0, _credentials.getCredentials)(options.env.GOOGLE_CLOUD_CREDENTIALS);
  }
  // Normalize authentication scope and audience values
  const scope = Array.isArray(options.scope) ? options.scope.join(",") : options.scope;
  const audience = Array.isArray(options.audience) ? options.audience.join(",") : options.audience;
  const tokenUrl = credentials.token_uri;
  // Create a cache key that can be used with Cloudflare Cache API
  const cacheKeyUrl = new URL(tokenUrl);
  cacheKeyUrl.searchParams.set("scope", scope ?? "");
  cacheKeyUrl.searchParams.set("aud", audience ?? "");
  cacheKeyUrl.searchParams.set("key", credentials.private_key_id);
  const cacheKey = cacheKeyUrl.toString();
  // Attempt to retrieve the token from the cache
  const cache = options.cache ?? defaultCache;
  const cacheValue = cache.get(cacheKey);
  let now = Math.floor(Date.now() / 1000);
  if (cacheValue) {
    if (cacheValue.created > now - 60 * 60) {
      let token = await cacheValue.promise;
      if (token.expires > now) {
        return token.token;
      } else {
        const nextValue = cache.get(cacheKey);
        if (nextValue && nextValue !== cacheValue) {
          token = await nextValue.promise;
          if (token.expires > now) {
            return token.token;
          } else {
            cache.delete(cacheKey);
          }
        }
      }
    } else {
      cache.delete(cacheKey);
    }
  }
  const promise = (async () => {
    let res;
    // Attempt to retrieve the token from Cloudflare cache
    // if the code is running in Cloudflare Workers environment
    if (_env.canUseDefaultCache) {
      res = await caches.default.match(cacheKey);
    }
    if (!res) {
      now = Math.floor(Date.now() / 1000);
      // Request a new token from the Google Cloud API
      const jwt = await (0, _customToken.createCustomToken)({
        credentials,
        scope: options.audience ?? options.scope
      });
      const body = new URLSearchParams();
      body.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
      body.append("assertion", jwt);
      res = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body
      });
      if (!res.ok) {
        const error = await res.json().then(data => data?.error_description).catch(() => undefined);
        throw new _error.FetchError(error ?? "Failed to fetch an access token.", {
          response: res
        });
      }
      if (_env.canUseDefaultCache) {
        let cacheRes = res.clone();
        cacheRes = new Response(cacheRes.body, cacheRes);
        cacheRes.headers.set("Cache-Control", `max-age=3590, public`);
        cacheRes.headers.set("Last-Modified", new Date().toUTCString());
        const cachePromise = caches.default.put(cacheKey, cacheRes);
        if (options.waitUntil) {
          options.waitUntil(cachePromise);
        }
      }
    }
    const data = await res.json();
    if ("id_token" in data) {
      const claims = (0, _jose.decodeJwt)(data.id_token);
      return {
        token: data.id_token,
        expires: claims.exp
      };
    }
    const lastModified = res.headers.get("last-modified");
    const expires = lastModified ? Math.floor(new Date(lastModified).valueOf() / 1000) + data.expires_in : now + data.expires_in;
    return {
      expires,
      token: data.access_token
    };
  })();
  cache.set(cacheKey, {
    created: now,
    promise
  });
  return await promise.then(data => data.token);
}
// #endregion