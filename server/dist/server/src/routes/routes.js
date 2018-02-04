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
const logger_1 = require("../logger/logger");
const poll_1 = require("../services/poll/poll");
const auth_1 = require("../services/auth/auth");
const notifications_1 = require("../services/notifications/notifications");
const success = {
    message: 'OK'
};
function initRoutes(app) {
    app.post('/api/poll', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let poll = yield poll_1.createPoll(req.body);
            res.json(poll);
        }
        catch (err) {
            logger_1.Logger.error('Error while creating poll', err);
            res.status(500).json(err);
        }
    }));
    app.get('/api/poll/:token', identifyToken, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let tokenInfo = res.locals.tokenInfo;
            let token = tokenInfo.token;
            if (!tokenInfo)
                res.status(404).send();
            logger_1.Logger.info('tokenInfo', tokenInfo);
            let poll = yield poll_1.getPoll(tokenInfo.id);
            // Do not send results to voters
            if (tokenInfo.type === 'v') {
                poll.questions.forEach(q => q.answers.forEach(a => a.votes = 0));
                delete poll.links;
            }
            res.json(poll);
        }
        catch (err) {
            logger_1.Logger.error('error while getting poll', err);
            res.status(500).json(err);
        }
    }));
    app.post('/api/admin/set', identifyToken, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let tokenInfo = res.locals.tokenInfo;
            let token = tokenInfo.token;
            if (!tokenInfo || tokenInfo.type !== 'a')
                res.status(404).send();
            let poll = yield poll_1.setPollStep(tokenInfo.id, req.body['step']);
            yield notifications_1.sendUpdateNotification(tokenInfo.id, token);
            res.status(200).json(poll);
        }
        catch (err) {
            logger_1.Logger.error('error while setting poll step', err);
            res.status(500).json(err);
        }
    }));
    app.post('api/admin/reset', identifyToken, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let tokenInfo = res.locals.tokenInfo;
            let token = tokenInfo.token;
            if (!tokenInfo || tokenInfo.type !== 'a')
                res.status(404).send();
            let poll = yield poll_1.setPollStep(tokenInfo.id, req.body['step']);
            yield notifications_1.sendUpdateNotification(tokenInfo.id, token);
            res.status(200).json(poll);
        }
        catch (err) {
            logger_1.Logger.error('error while setting poll step', err);
            res.status(500).json(err);
        }
    }));
    app.post('/api/vote', identifyToken, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let tokenInfo = res.locals.tokenInfo;
            let token = tokenInfo.token;
            if (!tokenInfo || tokenInfo.type !== 'v')
                res.status(404).send();
            yield poll_1.addPollVote(tokenInfo.id, req.body['questionId'], req.body['answers']);
            yield notifications_1.sendUpdateNotification(tokenInfo.id, token);
            res.status(200).json(success);
        }
        catch (err) {
            logger_1.Logger.error('error while posting vote', err);
            res.status(500).json(err);
        }
    }));
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
