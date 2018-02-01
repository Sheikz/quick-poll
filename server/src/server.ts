import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Logger } from './logger/logger';
import { initRoutes } from './routes/routes';

const PORT = 3000;

const server = express();

server.use(bodyParser.json());
initRoutes(server);

server.listen(PORT, () => {
    Logger.info('Server is listening on port '+PORT);
})
