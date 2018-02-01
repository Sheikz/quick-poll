"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const logger_1 = require("./logger/logger");
const routes_1 = require("./routes/routes");
const PORT = 3000;
const server = express();
server.use(bodyParser.json());
routes_1.initRoutes(server);
server.listen(PORT, () => {
    logger_1.Logger.info('Server is listening on port ' + PORT);
});
