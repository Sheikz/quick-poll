import * as express from 'express';
import { Logger } from '../logger/logger';

export function initRoutes(app: express.Express){

    app.post('/api/poll', (req, res) => {

        Logger.info('got poll', req.body);
    });
}