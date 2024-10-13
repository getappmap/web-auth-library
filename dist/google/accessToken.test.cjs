"use strict";

var _jose = require("jose");
var _env = _interopRequireDefault(require("../test/env.cjs"));
var _accessToken = require("./accessToken.cjs");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* SPDX-FileCopyrightText: 2022-present Kriasoft */
/* SPDX-License-Identifier: MIT */

test("getAccessToken({ credentials, scope })", async () => {
  const accessToken = await (0, _accessToken.getAccessToken)({
    credentials: _env.default.GOOGLE_CLOUD_CREDENTIALS,
    scope: "https://www.googleapis.com/auth/cloud-platform"
  });
  expect(accessToken?.substring(0, 30)).toEqual(expect.stringContaining("ya29.c."));
});
test("getAccessToken({ credentials, audience })", async () => {
  const idToken = await (0, _accessToken.getAccessToken)({
    credentials: _env.default.GOOGLE_CLOUD_CREDENTIALS,
    audience: "https://example.com"
  });
  expect(idToken?.substring(0, 30)).toEqual(expect.stringContaining("eyJhbGciOi"));
  expect((0, _jose.decodeJwt)(idToken)).toEqual(expect.objectContaining({
    aud: "https://example.com",
    email_verified: true,
    iss: "https://accounts.google.com"
  }));
});