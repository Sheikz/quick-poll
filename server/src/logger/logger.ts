import * as winston from 'winston';
import * as fs from 'fs';
import {config} from '../config/config';

const tsFormat = () => (new Date()).toLocaleString();
const today = () => (new Date()).getDate();
const logDir = config.logging.dir;

try {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }
} catch (err) {
    winston.error('Error while creating the log directory', err);
}

/** Define and export the logger */
export const Logger = new (winston.Logger)({
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

Logger.level = config.logging.level;

Logger.info('Winston logger initialized!');
