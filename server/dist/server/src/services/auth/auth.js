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
function generateId(id) {
    return encrypt(id);
}
exports.generateId = generateId;
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
function getTokenInfo(token) {
    let d = decrypt(token);
    const values = d.split('-');
    if (values.length !== 2 || !['admin', 'results', 'vote'].some(v => v === values[0]))
        return null;
    return {
        type: values[0],
        id: parseInt(values[1]),
        token: token
    };
}
exports.getTokenInfo = getTokenInfo;
