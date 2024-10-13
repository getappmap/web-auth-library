"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canUseDefaultCache = void 0;
/* SPDX-FileCopyrightText: 2022-present Kriasoft */
/* SPDX-License-Identifier: MIT */
const canUseDefaultCache = /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
typeof globalThis.caches?.default?.put === "function";
exports.canUseDefaultCache = canUseDefaultCache;