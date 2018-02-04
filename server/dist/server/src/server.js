"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const logger_1 = require("./logger/logger");
const routes_1 = require("./routes/routes");
const PORT = process.env.PORT || 4200;
const server = express();
server.use(bodyParser.json());
routes_1.initRoutes(server);
let publicFolder = path.join(__dirname, '..', '..', '..', '..', 'client', 'dist');
logger_1.Logger.info('Serving folder: ', publicFolder);
server.use('/', express.static(publicFolder));
server.use('/**/*', express.static(publicFolder));
server.listen(PORT, () => {
    logger_1.Logger.info('Server is listening on port ' + PORT);
});
