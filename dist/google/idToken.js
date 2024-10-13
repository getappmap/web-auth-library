/* SPDX-FileCopyrightText: 2022-present Kriasoft */
/* SPDX-License-Identifier: MIT */
import { decodeProtectedHeader, errors, jwtVerify } from "jose";
import { canUseDefaultCache } from "../core/env.js";
import { FetchError } from "../core/error.js";
import { logOnce } from "../core/utils.js";
import { getCredentials, importPublicKey } from "./credentials.js";
import { createCustomToken } from "./customToken.js";
/**
 * Creates a User ID token using Google Cloud service account credentials.
 */
export async function getIdToken(options) {
    const uid = options?.uid;
    if (!uid) {
        throw new TypeError("Missing uid");
    }
    let apiKey = options?.apiKey;
    if (!apiKey) {
        if (options?.env?.FIREBASE_API_KEY) {
            apiKey = options.env.FIREBASE_API_KEY;
        }
        else {
            throw new TypeError("Missing apiKey");
        }
    }
    let credentials = options?.credentials;
    if (credentials) {
        credentials = getCredentials(credentials);
    }
    else {
        if (options?.env?.GOOGLE_CLOUD_CREDENTIALS) {
            credentials = getCredentials(options.env.GOOGLE_CLOUD_CREDENTIALS);
        }
        else {
            throw new TypeError("Missing credentials");
        }
    }
    let projectId = options?.projectId;
    if (!projectId && options?.env?.GOOGLE_CLOUD_PROJECT) {
        projectId = options.env.GOOGLE_CLOUD_PROJECT;
    }
    if (!projectId) {
        projectId = credentials.project_id;
    }
    if (!projectId) {
        throw new TypeError("Missing projectId");
    }
    const customToken = await createCustomToken({
        ...options.claims,
        credentials,
        audience: "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit",
        uid: options.uid,
    });
    const url = new URL("https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken"); // prettier-ignore
    url.searchParams.set("key", apiKey);
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            token: customToken,
            returnSecureToken: true,
        }),
    });
    if (!res.ok) {
        const message = await res
            .json()
            .then((body) => body?.error?.message)
            .catch(() => undefined);
        throw new FetchError(message ?? "Failed to verify custom token", {
            response: res,
        });
    }
    return await res.json();
}
/**
 * Verifies the authenticity of an ID token issued by Google.
 *
 * @example
 *   const token = await verifyIdToken({
 *     idToken: "eyJhbGciOiJSUzI1NiIsImtpZC...yXQ"
 *     projectId: "my-project"
 *     waitUntil: ctx.waitUntil,
 *   });
 *
 * @example
 *   const token = await verifyIdToken({
 *     idToken: "eyJhbGciOiJSUzI1NiIsImtpZC...yXQ"
 *     waitUntil: ctx.waitUntil,
 *     env: { GOOGLE_CLOUD_PROJECT: "my-project" }
 *   });
 *
 * @see https://firebase.google.com/docs/auth/admin/verify-id-tokens
 *
 * @throws {TypeError} if the ID token is missing
 * @throws {FetchError} if unable to fetch the public key
 * @throws {JWTClaimValidationFailed} if the token is invalid
 * @throws {JWTExpired} if the token has expired
 */
export async function verifyIdToken(options) {
    if (!options?.idToken) {
        throw new TypeError(`Missing "idToken"`);
    }
    let projectId = options?.projectId;
    if (projectId === undefined) {
        projectId = options?.env?.GOOGLE_CLOUD_PROJECT;
    }
    if (projectId === undefined && options?.env?.GOOGLE_CLOUD_CREDENTIALS) {
        const credentials = getCredentials(options.env.GOOGLE_CLOUD_CREDENTIALS);
        projectId = credentials?.project_id;
    }
    if (projectId === undefined) {
        throw new TypeError(`Missing "projectId"`);
    }
    if (!options.waitUntil && canUseDefaultCache) {
        logOnce("warn", "verifyIdToken", "Missing `waitUntil` option.");
    }
    // Import the public key from the Google Cloud project
    const header = decodeProtectedHeader(options.idToken);
    const now = Math.floor(Date.now() / 1000);
    const key = await importPublicKey({
        keyId: header.kid,
        certificateURL: "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com",
        waitUntil: options.waitUntil,
    });
    const { payload } = await jwtVerify(options.idToken, key, {
        audience: projectId == null ? undefined : projectId,
        issuer: projectId == null
            ? undefined
            : `https://securetoken.google.com/${projectId}`,
        maxTokenAge: "1h",
    });
    if (!payload.sub) {
        throw new errors.JWTClaimValidationFailed(`Missing "sub" claim`, "sub");
    }
    if (typeof payload.auth_time === "number" && payload.auth_time > now) {
        throw new errors.JWTClaimValidationFailed(`Unexpected "auth_time" claim value`, "auth_time");
    }
    return payload;
}
