/// <reference types="@cloudflare/workers-types" />
export declare class FetchError extends Error {
    readonly name: string;
    readonly response: Response;
    constructor(message: string, options: {
        response: Response;
        cause?: unknown;
    });
}
