import { KeyLike } from "jose";
/**
 * Normalizes Google Cloud Platform (GCP) service account credentials.
 */
export declare function getCredentials(credentials: Credentials | string): Credentials;
/**
 * Imports a private key from the provided Google Cloud (GCP)
 * service account credentials.
 */
export declare function getPrivateKey(options: {
    credentials: Credentials | string;
}): Promise<KeyLike>;
/**
 * Imports a public key for the provided Google Cloud (GCP)
 * service account credentials.
 *
 * @throws {FetchError} - If the X.509 certificate could not be fetched.
 */
export declare function importPublicKey(options: {
    /**
     * Public key ID (kid).
     */
    keyId: string;
    /**
     * The X.509 certificate URL.
     * @default "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
     */
    certificateURL?: string;
    waitUntil?: (promise: Promise<any>) => void;
}): Promise<KeyLike>;
/**
 * Service account credentials for Google Cloud Platform (GCP).
 *
 * @see https://cloud.google.com/iam/docs/creating-managing-service-account-keys
 */
export type Credentials = {
    type: string;
    project_id: string;
    private_key_id: string;
    private_key: string;
    client_id: string;
    client_email: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_x509_cert_url: string;
};
