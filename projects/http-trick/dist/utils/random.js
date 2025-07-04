"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomString = randomString;
exports.uniqueId = uniqueId;
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const charactersLength = characters.length;
function randomString(len) {
    let result = '';
    for (var i = 0; i < len; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function uniqueId() {
    return randomString(7) + Date.now();
}
//# sourceMappingURL=random.js.map