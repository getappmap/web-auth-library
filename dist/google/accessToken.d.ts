import { type Credentials } from "./credentials.js";
/**
 * Fetches an access token from Google Cloud API using the provided
 * service account credentials.
 *
 * @throws {FetchError} — If the access token could not be fetched.
 */
export declare function getAccessToken(options: Options): Promise<string>;
type Options = {
    /**
     * Google Cloud service account credentials.
     * @see https://cloud.google.com/iam/docs/creating-managing-service-account-keys
     * @default env.GOOGLE_CLOUD_PROJECT
     */
    credentials: Credentials | string;
    /**
     * Authentication scope(s).
     */
    scope?: string[] | string;
    /**
     * Recipients that the ID token should be issued for.
     */
    audience?: string[] | string;
    env?: {
        /**
         * Google Cloud project ID.
         */
        GOOGLE_CLOUD_PROJECT?: string;
        /**
         * Google Cloud service account credentials.
         * @see https://cloud.google.com/iam/docs/creating-managing-service-account-keys
         */
        GOOGLE_CLOUD_CREDENTIALS: string;
    };
    waitUntil?: (promise: Promise<any>) => void;
    cache?: Map<string, any>;
};
export {};
