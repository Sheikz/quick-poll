"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const config_1 = require("../../config/config");
const algorithm = 'aes192';
const linkUrlBase = config_1.config.appUrl;
const password = config_1.config.crypto.password;
function generateLinks(id) {
    return {
        vote: `${linkUrlBase}/vote/${encrypt(`vote-${id}`)}`,
        results: `${linkUrlBase}/results/${encrypt(`results-${id}`)}`,
        admin: `${linkUrlBase}/admin/${encrypt(`admin-${id}`)}`,
    };
}
exports.generateLinks = generateLinks;
function encrypt(text) {
    const cipher = crypto.createCipher(algorithm, password);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}
function decrypt(text) {
    const decipher = crypto.createDecipher(algorithm, password);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}
exports.decrypt = decrypt;
