/* SPDX-FileCopyrightText: 2022-present Kriasoft */
/* SPDX-License-Identifier: MIT */
export class FetchError extends Error {
    name = "FetchError";
    response;
    constructor(message, options) {
        super(message, { cause: options?.cause });
        this.response = options.response;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, Error);
        }
    }
}
