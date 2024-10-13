/* SPDX-FileCopyrightText: 2022-present Kriasoft */
/* SPDX-License-Identifier: MIT */
const logOnceKeys = new Set();
export function logOnce(severity, key, message) {
    if (!logOnceKeys.has(key)) {
        logOnceKeys.add(key);
        console[severity](message);
    }
}
