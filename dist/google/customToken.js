/* SPDX-FileCopyrightText: 2022-present Kriasoft */
/* SPDX-License-Identifier: MIT */
import { SignJWT } from "jose";
import { getCredentials, getPrivateKey, } from "./credentials.js";
/**
 * Generates a custom authentication token (JWT)
 * from a Google Cloud (GCP) service account key.
 *
 * @example
 *   const customToken = await createCustomToken({
 *     credentials: env.GOOGLE_CLOUD_CREDENTIALS,
 *     scope: "https://www.googleapis.com/auth/cloud-platform",
 *   });
 *
 * @example
 *   const customToken = await createCustomToken({
 *     env: { GOOGLE_CLOUD_CREDENTIALS: "..." },
 *     scope: "https://www.example.com",
 *   });
 */
export async function createCustomToken(options) {
    /* eslint-disable-next-line prefer-const */
    let { credentials, scope, subject, audience, env, ...payload } = options;
    // Normalize credentials using env.GOOGLE_CLOUD_CREDENTIALS as a fallback
    if (credentials) {
        credentials = getCredentials(credentials);
    }
    else {
        if (!env?.GOOGLE_CLOUD_CREDENTIALS) {
            throw new TypeError("Missing credentials");
        }
        credentials = getCredentials(env.GOOGLE_CLOUD_CREDENTIALS);
    }
    // Normalize authentication scope (needs to be a string)
    scope = Array.isArray(scope) ? scope.join(" ") : scope;
    // Generate and sign a custom JWT token
    const privateKey = await getPrivateKey({ credentials });
    const customToken = await new SignJWT({ scope, ...payload })
        .setIssuer(credentials.client_email)
        .setAudience(audience ?? credentials.token_uri)
        .setSubject(subject ?? credentials.client_email)
        .setProtectedHeader({ alg: "RS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(privateKey);
    return customToken;
}
