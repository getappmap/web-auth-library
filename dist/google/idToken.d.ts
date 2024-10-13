import { Credentials } from "./credentials.js";
/**
 * Creates a User ID token using Google Cloud service account credentials.
 */
export declare function getIdToken(options: {
    /**
     * User ID.
     */
    uid: string;
    /**
     * Additional user claims.
     */
    claims?: Record<string, unknown>;
    /**
     * Google Cloud API key.
     * @see https://console.cloud.google.com/apis/credentials
     * @default env.FIREBASE_API_KEY
     */
    apiKey?: string;
    /**
     * Google Cloud project ID.
     * @default env.GOOGLE_CLOUD_PROJECT;
     */
    projectId?: string;
    /**
     * Google Cloud service account credentials.
     * @see https://cloud.google.com/iam/docs/creating-managing-service-account-keys
     * @default env.GOOGLE_CLOUD_PROJECT
     */
    credentials?: Credentials | string;
    /**
     * Alternatively, you can pass credentials via the environment variable.
     */
    env?: {
        /**
         * Google Cloud API key.
         * @see https://console.cloud.google.com/apis/credentials
         */
        FIREBASE_API_KEY: string;
        /**
         * Google Cloud project ID.
         */
        GOOGLE_CLOUD_PROJECT: string;
        /**
         * Google Cloud service account credentials.
         * @see https://cloud.google.com/iam/docs/creating-managing-service-account-keys
         */
        GOOGLE_CLOUD_CREDENTIALS: string;
    };
}): Promise<VerifyCustomTokenResponse>;
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
export declare function verifyIdToken(options: {
    /**
     * The ID token to verify.
     */
    idToken: string;
    /**
     * Google Cloud project ID. Set to `null` to disable the check.
     * @default env.GOOGLE_CLOUD_PROJECT
     */
    projectId?: string | null;
    /**
     * Alternatively, you can provide the following environment variables:
     */
    env?: {
        /**
         * Google Cloud project ID.
         */
        GOOGLE_CLOUD_PROJECT?: string;
        /**
         * Google Cloud service account credentials.
         * @see https://cloud.google.com/iam/docs/creating-managing-service-account-keys
         */
        GOOGLE_CLOUD_CREDENTIALS?: string;
    };
    waitUntil?: (promise: Promise<any>) => void;
}): Promise<UserToken>;
type VerifyCustomTokenResponse = {
    kind: "identitytoolkit#VerifyCustomTokenResponse";
    idToken: string;
    refreshToken: string;
    expiresIn: string;
    isNewUser: boolean;
};
export interface UserToken {
    /**
     * Always set to https://securetoken.google.com/GOOGLE_CLOUD_PROJECT
     */
    iss: string;
    /**
     * Always set to GOOGLE_CLOUD_PROJECT
     */
    aud: string;
    /**
     * The user's unique ID
     */
    sub: string;
    /**
     * The token issue time, in seconds since epoch
     */
    iat: number;
    /**
     * The token expiry time, normally 'iat' + 3600
     */
    exp: number;
    /**
     * The user's unique ID. Must be equal to 'sub'
     */
    user_id: string;
    /**
     * The time the user authenticated, normally 'iat'
     */
    auth_time: number;
    /**
     * The sign in provider, only set when the provider is 'anonymous'
     */
    provider_id?: "anonymous";
    /**
     * The user's primary email
     */
    email?: string;
    /**
     * The user's email verification status
     */
    email_verified?: boolean;
    /**
     * The user's primary phone number
     */
    phone_number?: string;
    /**
     * The user's display name
     */
    name?: string;
    /**
     * The user's profile photo URL
     */
    picture?: string;
    /**
     * Information on all identities linked to this user
     */
    firebase: {
        /**
         * The primary sign-in provider
         */
        sign_in_provider: SignInProvider;
        /**
         * A map of providers to the user's list of unique identifiers from
         * each provider
         */
        identities?: {
            [provider in SignInProvider]?: string[];
        };
    };
    /**
     * Custom claims set by the developer
     */
    [claim: string]: unknown;
    /**
     * @deprecated use `sub` instead
     */
    uid?: never;
}
export type SignInProvider = "custom" | "email" | "password" | "phone" | "anonymous" | "google.com" | "facebook.com" | "github.com" | "twitter.com" | "microsoft.com" | "apple.com";
export {};
