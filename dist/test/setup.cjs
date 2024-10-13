"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* SPDX-FileCopyrightText: 2022-present Kriasoft */
/* SPDX-License-Identifier: MIT */

_dotenv.default.config({
  path: "./test/test.override.env"
});
_dotenv.default.config({
  path: "./test/test.env"
});