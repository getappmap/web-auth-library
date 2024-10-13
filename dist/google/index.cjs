"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _accessToken = require("./accessToken.cjs");
Object.keys(_accessToken).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _accessToken[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _accessToken[key];
    }
  });
});
var _credentials = require("./credentials.cjs");
Object.keys(_credentials).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _credentials[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _credentials[key];
    }
  });
});
var _customToken = require("./customToken.cjs");
Object.keys(_customToken).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _customToken[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _customToken[key];
    }
  });
});
var _idToken = require("./idToken.cjs");
Object.keys(_idToken).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _idToken[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _idToken[key];
    }
  });
});