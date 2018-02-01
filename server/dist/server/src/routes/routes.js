"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../logger/logger");
const poll_1 = require("../services/poll/poll");
const auth_1 = require("../services/auth/auth");
const notifications_1 = require("../services/notifications/notifications");
const success = {
    message: 'OK'
};
function initRoutes(app) {
    app.post('/api/poll', (req, res) => {
        try {
            let poll = poll_1.createPoll(req.body);
            res.json(poll);
        }
        catch (err) {
            logger_1.Logger.error('Error while creating poll', err);
            res.status(500).json(err);
        }
    });
    app.get('/api/poll/:token', identifyToken, (req, res) => {
        try {
            let tokenInfo = res.locals.tokenInfo;
            let token = tokenInfo.token;
            if (!tokenInfo)
                res.status(404).send();
            let poll = poll_1.getPoll(tokenInfo.id);
            // Do not send results to voters
            if (tokenInfo.type === 'vote') {
                poll.questions.forEach(q => q.answers.forEach(a => a.votes = 0));
                delete poll.links;
            }
            res.json(poll);
        }
        catch (err) {
            logger_1.Logger.error('error while getting poll', err);
            res.status(500).json(err);
        }
    });
    app.post('/api/admin/set', identifyToken, (req, res) => {
        try {
            let tokenInfo = res.locals.tokenInfo;
            let token = tokenInfo.token;
            if (!tokenInfo || tokenInfo.type !== 'admin')
                res.status(404).send();
            let poll = poll_1.setPollStep(tokenInfo.id, req.body['step']);
            notifications_1.sendUpdateNotification(tokenInfo.id, token);
            res.status(200).json(poll);
        }
        catch (err) {
            logger_1.Logger.error('error while setting poll step', err);
            res.status(500).json(err);
        }
    });
    app.post('api/admin/reset', identifyToken, (req, res) => {
        try {
            let tokenInfo = res.locals.tokenInfo;
            let token = tokenInfo.token;
            if (!tokenInfo || tokenInfo.type !== 'admin')
                res.status(404).send();
            let poll = poll_1.setPollStep(tokenInfo.id, req.body['step']);
            notifications_1.sendUpdateNotification(tokenInfo.id, token);
            res.status(200).json(poll);
        }
        catch (err) {
            logger_1.Logger.error('error while setting poll step', err);
            res.status(500).json(err);
        }
    });
    app.post('/api/vote', identifyToken, (req, res) => {
        try {
            let tokenInfo = res.locals.tokenInfo;
            let token = tokenInfo.token;
            if (!tokenInfo || tokenInfo.type !== 'vote')
                res.status(404).send();
            poll_1.addPollVote(tokenInfo.id, req.body['questionId'], req.body['answers']);
            notifications_1.sendUpdateNotification(tokenInfo.id, token);
            res.status(200).json(success);
        }
        catch (err) {
            logger_1.Logger.error('error while posting vote', err);
            res.status(500).json(err);
        }
    });
}
exports.initRoutes = initRoutes;
function identifyToken(req, res, next) {
    let token = req.body['token'] || req.params['token'];
    if (!token) {
        res.status(404).json('Missing token');
    }
    let t = auth_1.getTokenInfo(token);
    res.locals.tokenInfo = t;
    next();
}
