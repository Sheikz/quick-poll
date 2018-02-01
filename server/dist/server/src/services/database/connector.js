"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
const logger_1 = require("../../logger/logger");
const config_1 = require("./../../config/config");
const pool = mysql.createPool(config_1.config.db);
pool.config.connectionLimit = 1000;
pool.on('connection', () => logger_1.Logger.info('new connection'));
pool.on('release', () => logger_1.Logger.info('connection released', { active: pool._allConnections.length, free: pool._freeConnections.length }));
pool.on('acquire', () => logger_1.Logger.info('connection acquired', { active: pool._allConnections.length, free: pool._freeConnections.length }));
class Connection {
    constructor(connection) {
        this.connection = connection;
    }
    static get() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                pool.getConnection((err, conn) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        logger_1.Logger.error('Error while getting a connection from the pool', err);
                        reject(err);
                    }
                    else {
                        const connection = new Connection(conn);
                        resolve(connection);
                    }
                }));
            });
        });
    }
    query(query, values = {}) {
        return new Promise((resolve, reject) => {
            const options = {
                sql: query,
                values: values
            };
            this.connection.query(options, (error, results, field) => {
                if (error) {
                    logger_1.Logger.error('SQL Error', { message: error.message, sql: error.sql });
                    // TODO: Send to bugsnag
                    reject(error);
                    // Hide SQL specific error from client
                    // reject({
                    //     type: 'ERROR',
                    //     message: 'Internal server error'
                    // });
                }
                else {
                    resolve(results);
                }
            });
        });
    }
    release() {
        this.connection.release();
    }
}
exports.Connection = Connection;
class Transaction {
    constructor(connection) {
        this.connection = connection;
    }
    static create() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield Connection.get();
            const transaction = new Transaction(connection);
            yield transaction.start();
            return transaction;
        });
    }
    getConnection() {
        return this.connection;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connection.query('START TRANSACTION');
        });
    }
    commit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connection.query('COMMIT');
            this.connection.release();
        });
    }
    rollback() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connection.query('ROLLBACK');
            this.connection.release();
        });
    }
}
exports.Transaction = Transaction;
