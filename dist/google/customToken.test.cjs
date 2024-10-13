"use strict";

var _jose = require("jose");
var _env = _interopRequireDefault(require("../test/env.cjs"));
var _customToken = require("./customToken.cjs");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* SPDX-FileCopyrightText: 2022-present Kriasoft */
/* SPDX-License-Identifier: MIT */

test("createCustomToken({ credentials, scope })", async () => {
  const customToken = await (0, _customToken.createCustomToken)({
    credentials: _env.default.GOOGLE_CLOUD_CREDENTIALS,
    scope: "https://www.example.com"
  });
  expect(customToken?.substring(0, 30)).toEqual(expect.stringContaining("eyJhbGciOi"));
  expect((0, _jose.decodeJwt)(customToken)).toEqual(expect.objectContaining({
    iss: expect.stringMatching(/\.iam\.gserviceaccount\.com$/),
    aud: "https://oauth2.googleapis.com/token",
    scope: "https://www.example.com",
    iat: expect.any(Number),
    exp: expect.any(Number)
  }));
});
test("createCustomToken({ credentials, scope: scopes })", async () => {
  const customToken = await (0, _customToken.createCustomToken)({
    credentials: _env.default.GOOGLE_CLOUD_CREDENTIALS,
    scope: ["https://www.example.com", "https://beta.example.com"]
  });
  expect(customToken?.substring(0, 30)).toEqual(expect.stringContaining("eyJhbGciOi"));
  expect((0, _jose.decodeJwt)(customToken)).toEqual(expect.objectContaining({
    iss: expect.stringMatching(/\.iam\.gserviceaccount\.com$/),
    aud: "https://oauth2.googleapis.com/token",
    scope: "https://www.example.com https://beta.example.com",
    iat: expect.any(Number),
    exp: expect.any(Number)
  }));
});
test("createCustomToken({ env, scope })", async () => {
  const customToken = await (0, _customToken.createCustomToken)({
    scope: "https://www.googleapis.com/auth/cloud-platform",
    env: {
      GOOGLE_CLOUD_CREDENTIALS: _env.default.GOOGLE_CLOUD_CREDENTIALS
    }
  });
  expect(customToken?.substring(0, 30)).toEqual(expect.stringContaining("eyJhbGciOi"));
  expect((0, _jose.decodeJwt)(customToken)).toEqual(expect.objectContaining({
    iss: expect.stringMatching(/\.iam\.gserviceaccount\.com$/),
    aud: "https://oauth2.googleapis.com/token",
    scope: "https://www.googleapis.com/auth/cloud-platform",
    iat: expect.any(Number),
    exp: expect.any(Number)
  }));
});
test("createCustomToken({ env, scope })", async () => {
  const promise = (0, _customToken.createCustomToken)({
    scope: "https://www.googleapis.com/auth/cloud-platform"
  });
  expect(promise).rejects.toThrow(new TypeError("Missing credentials"));
});