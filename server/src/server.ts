import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';

import { Logger } from './logger/logger';
import { initRoutes } from './routes/routes';

const PORT = process.env.PORT || 3000

const server = express();

server.use(bodyParser.json());
initRoutes(server);

let publicFolder = path.join(__dirname, '..', '..', '..', '..', 'client', 'dist');
Logger.info('Serving folder: ', publicFolder);
server.use('/', express.static(publicFolder));
server.use('/**/*', express.static(publicFolder));

server.listen(PORT, () => {
    Logger.info('Server is listening on port '+PORT);
})
