import { type Credentials } from "./credentials.js";
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
export declare function createCustomToken(options: {
    /**
     * Google Cloud service account credentials.
     * @see https://cloud.google.com/iam/docs/creating-managing-service-account-keys
     * @default env.GOOGLE_CLOUD_PROJECT
     */
    credentials?: Credentials | string;
    /**
     * Authentication scope.
     * @example "https://www.googleapis.com/auth/cloud-platform"
     */
    scope?: string | string[];
    /**
     * The principal that is the subject of the JWT.
     */
    subject?: string;
    /**
     * The recipient(s) that the JWT is intended for.
     */
    audience?: string | string[];
    /**
     * Any other JWT clams.
     */
    [propName: string]: unknown;
    /**
     * Alternatively, you can pass credentials via the environment variable.
     */
    env?: {
        /**
         * Google Cloud service account credentials.
         * @see https://cloud.google.com/iam/docs/creating-managing-service-account-keys
         */
        GOOGLE_CLOUD_CREDENTIALS: string;
    };
}): Promise<string>;
