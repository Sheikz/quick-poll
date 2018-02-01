"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const fs = require("fs");
const config_1 = require("../config/config");
const tsFormat = () => (new Date()).toLocaleString();
const today = () => (new Date()).getDate();
const logDir = config_1.config.logging.dir;
try {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }
}
catch (err) {
    winston.error('Error while creating the log directory', err);
}
/** Define and export the logger */
exports.Logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            colorize: true,
            timestamp: tsFormat,
            prettyPrint: true
        }),
        new (winston.transports.File)({
            filename: logDir + '/app.log',
            timestamp: tsFormat,
            json: false
        })
    ]
});
exports.Logger.level = config_1.config.logging.level;
exports.Logger.info('Winston logger initialized!');
