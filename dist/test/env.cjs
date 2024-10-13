"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _envalid = require("envalid");
/* SPDX-FileCopyrightText: 2022-present Kriasoft */
/* SPDX-License-Identifier: MIT */
var _default = (0, _envalid.cleanEnv)(process.env, {
  GOOGLE_CLOUD_PROJECT: (0, _envalid.str)(),
  GOOGLE_CLOUD_CREDENTIALS: (0, _envalid.str)(),
  FIREBASE_API_KEY: (0, _envalid.str)()
});
exports.default = _default;