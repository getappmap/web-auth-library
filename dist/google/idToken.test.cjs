"use strict";

var _jose = require("jose");
var _env = _interopRequireDefault(require("../test/env.cjs"));
var _idToken = require("./idToken.cjs");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* SPDX-FileCopyrightText: 2022-present Kriasoft */
/* SPDX-License-Identifier: MIT */

test("getIdToken({ uid, apiKey, projectId, credentials })", async () => {
  const token = await (0, _idToken.getIdToken)({
    uid: "temp",
    claims: {
      foo: "bar"
    },
    apiKey: _env.default.FIREBASE_API_KEY,
    credentials: _env.default.GOOGLE_CLOUD_CREDENTIALS
  });
  expect(token).toEqual(expect.objectContaining({
    kind: "identitytoolkit#VerifyCustomTokenResponse",
    idToken: expect.stringMatching(/^eyJhbGciOiJSUzI1NiIs/),
    refreshToken: expect.any(String),
    expiresIn: "3600",
    isNewUser: expect.any(Boolean)
  }));
  expect((0, _jose.decodeJwt)(token.idToken)).toEqual(expect.objectContaining({
    sub: "temp",
    user_id: "temp",
    aud: _env.default.GOOGLE_CLOUD_PROJECT,
    iss: `https://securetoken.google.com/${_env.default.GOOGLE_CLOUD_PROJECT}`,
    iat: expect.any(Number),
    exp: expect.any(Number),
    auth_time: expect.any(Number)
  }));
});
test("verifyIdToken({ idToken })", async () => {
  const {
    idToken
  } = await (0, _idToken.getIdToken)({
    uid: "temp",
    apiKey: _env.default.FIREBASE_API_KEY,
    credentials: _env.default.GOOGLE_CLOUD_CREDENTIALS
  });
  const token = await (0, _idToken.verifyIdToken)({
    idToken,
    env: _env.default
  });
  expect(token).toEqual(expect.objectContaining({
    aud: _env.default.GOOGLE_CLOUD_PROJECT,
    iss: `https://securetoken.google.com/${_env.default.GOOGLE_CLOUD_PROJECT}`,
    sub: "temp",
    user_id: "temp",
    iat: expect.any(Number),
    exp: expect.any(Number)
  }));
});