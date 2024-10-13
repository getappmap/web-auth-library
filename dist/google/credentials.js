/* SPDX-FileCopyrightText: 2022-present Kriasoft */
/* SPDX-License-Identifier: MIT */
import { importPKCS8, importX509 } from "jose";
import { FetchError } from "../core/error.js";
const inFlight = new Map();
const cache = new Map();
/**
 * Normalizes Google Cloud Platform (GCP) service account credentials.
 */
export function getCredentials(credentials) {
    return typeof credentials === "string" || credentials instanceof String
        ? Object.freeze(JSON.parse(credentials))
        : Object.isFrozen(credentials)
            ? credentials
            : Object.freeze(credentials);
}
/**
 * Imports a private key from the provided Google Cloud (GCP)
 * service account credentials.
 */
export function getPrivateKey(options) {
    const credentials = getCredentials(options.credentials);
    return importPKCS8(credentials.private_key, "RS256");
}
/**
 * Imports a public key for the provided Google Cloud (GCP)
 * service account credentials.
 *
 * @throws {FetchError} - If the X.509 certificate could not be fetched.
 */
export async function importPublicKey(options) {
    const keyId = options.keyId;
    const certificateURL = options.certificateURL ?? "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"; // prettier-ignore
    const cacheKey = `${certificateURL}?key=${keyId}`;
    const value = cache.get(cacheKey);
    const now = Date.now();
    async function fetchKey() {
        // Fetch the public key from Google's servers
        const res = await fetch(certificateURL);
        if (!res.ok) {
            const error = await res
                .json()
                .then((data) => data.error.message)
                .catch(() => undefined);
            throw new FetchError(error ?? "Failed to fetch the public key", {
                response: res,
            });
        }
        const data = await res.json();
        const x509 = data[keyId];
        if (!x509) {
            throw new FetchError(`Public key "${keyId}" not found.`, {
                response: res,
            });
        }
        const key = await importX509(x509, "RS256");
        // Resolve the expiration time of the key
        const maxAge = res.headers.get("cache-control")?.match(/max-age=(\d+)/)?.[1]; // prettier-ignore
        const expires = Date.now() + Number(maxAge ?? "3600") * 1000;
        // Update the local cache
        cache.set(cacheKey, { key, expires });
        inFlight.delete(keyId);
        return key;
    }
    // Attempt to read the key from the local cache
    if (value) {
        if (value.expires > now + 10_000) {
            // If the key is about to expire, start a new request in the background
            if (value.expires - now < 600_000) {
                const promise = fetchKey();
                inFlight.set(cacheKey, promise);
                if (options.waitUntil) {
                    options.waitUntil(promise);
                }
            }
            return value.key;
        }
        else {
            cache.delete(cacheKey);
        }
    }
    // Check if there is an in-flight request for the same key ID
    let promise = inFlight.get(cacheKey);
    // If not, start a new request
    if (!promise) {
        promise = fetchKey();
        inFlight.set(cacheKey, promise);
    }
    return await promise;
}
