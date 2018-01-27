"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../logger/logger");
function initRoutes(app) {
    app.post('/api/poll', (req, res) => {
        logger_1.Logger.info('got poll', req.body);
    });
}
exports.initRoutes = initRoutes;
