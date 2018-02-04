import * as mysql from 'mysql';
import { Logger } from '../../logger/logger';
import { config } from './../../config/config';
import { PoolConnection, Query, QueryFunction } from 'mysql';

const dbUrl = process.env.CLEARDB_DATABASE_URL || config.db;

const pool = mysql.createPool(dbUrl);
pool.config.connectionLimit = 1000;

export class Connection {

    constructor(private connection: mysql.PoolConnection) {
    }

    static async get(): Promise<Connection> {
        return new Promise<Connection>((resolve, reject) => {
            pool.getConnection(async (err, conn) => {
                if (err) {
                    Logger.error('Error while getting a connection from the pool', err);
                    reject(err);
                } else {
                    const connection = new Connection(conn);
                    resolve(connection);
                }
            });
        });
    }

    query(query: string, values: any = {}): Promise<any[]> {
        return new Promise((resolve, reject) => {

            const options = {
                sql: query,
                values: values
            };

            this.connection.query(options, (error, results, field) => {
                if (error) {
                    Logger.error('SQL Error', {message: error.message, sql: error.sql});
                    // TODO: Send to bugsnag
                    reject(error);
                    // Hide SQL specific error from client
                    // reject({
                    //     type: 'ERROR',
                    //     message: 'Internal server error'
                    // });
                } else {
                    resolve(results);
                }
            });
        });
    }

    release() {
        this.connection.release();
    }
}

export class Transaction {

    constructor(private connection: Connection) {
    }

    static async create(): Promise<Transaction> {
        const connection = await Connection.get();
        const transaction = new Transaction(connection);
        await transaction.start();
        return transaction;
    }

    getConnection() {
        return this.connection;
    }

    private async start() {
        await this.connection.query('START TRANSACTION');
    }

    async commit() {
        await this.connection.query('COMMIT');
        this.connection.release();
    }

    async rollback() {
        await this.connection.query('ROLLBACK');
        this.connection.release();
    }
}
