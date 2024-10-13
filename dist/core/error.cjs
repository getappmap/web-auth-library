"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FetchError = void 0;
/* SPDX-FileCopyrightText: 2022-present Kriasoft */
/* SPDX-License-Identifier: MIT */
class FetchError extends Error {
  name = "FetchError";
  response;
  constructor(message, options) {
    super(message, {
      cause: options?.cause
    });
    this.response = options.response;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Error);
    }
  }
}
exports.FetchError = FetchError;