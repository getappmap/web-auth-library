"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logOnce = logOnce;
/* SPDX-FileCopyrightText: 2022-present Kriasoft */
/* SPDX-License-Identifier: MIT */
const logOnceKeys = new Set();
function logOnce(severity, key, message) {
  if (!logOnceKeys.has(key)) {
    logOnceKeys.add(key);
    console[severity](message);
  }
}