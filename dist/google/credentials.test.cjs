"use strict";

var _env = _interopRequireDefault(require("../test/env.cjs"));
var _credentials = require("./credentials.cjs");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* SPDX-FileCopyrightText: 2022-present Kriasoft */
/* SPDX-License-Identifier: MIT */

test("getPrivateKey({ credentials })", async () => {
  const privateKey = await (0, _credentials.getPrivateKey)({
    credentials: _env.default.GOOGLE_CLOUD_CREDENTIALS
  });
  expect(privateKey).toEqual(expect.objectContaining({
    algorithm: expect.objectContaining({
      hash: {
        name: "SHA-256"
      },
      modulusLength: 2048,
      name: "RSASSA-PKCS1-v1_5"
    })
  }));
});
test("importPublicKey({ keyId, certificateURL })", async () => {
  const credentials = (0, _credentials.getCredentials)(_env.default.GOOGLE_CLOUD_CREDENTIALS);
  const privateKey = await (0, _credentials.importPublicKey)({
    keyId: credentials.private_key_id,
    certificateURL: credentials.client_x509_cert_url
  });
  expect(privateKey).toEqual(expect.objectContaining({
    algorithm: expect.objectContaining({
      hash: {
        name: "SHA-256"
      },
      modulusLength: 2048,
      name: "RSASSA-PKCS1-v1_5"
    })
  }));
});