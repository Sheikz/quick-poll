import * as express from 'express';
import { Logger } from '../logger/logger';
import { getPoll, setPollStep, addPollVote, createPoll } from '../services/poll/poll';
import { generateLinks, decrypt, getTokenInfo } from '../services/auth/auth';
import * as _ from 'lodash';
import { publish, sendUpdateNotification } from '../services/notifications/notifications';

const success = {
    message: 'OK'
}

export function initRoutes(app: express.Express){

    app.post('/api/poll', (req, res) => {

        try {
            let poll = createPoll(req.body);
            res.json(poll);
        }
        catch(err){
            Logger.error('Error while creating poll', err);
            res.status(500).json(err);
        }
    });

    app.get('/api/poll/:token', identifyToken, (req, res) => {

        try {
            let tokenInfo = res.locals.tokenInfo;
            let token = tokenInfo.token;
            if (!tokenInfo)
                res.status(404).send();

            let poll = getPoll(tokenInfo.id);

            // Do not send results to voters
            if (tokenInfo.type === 'vote'){
                poll.questions.forEach(q => q.answers.forEach(a => a.votes = 0))
                delete poll.links;
            }

            res.json(poll);
        }
        catch(err){
            Logger.error('error while getting poll', err);
            res.status(500).json(err);
        }
    })

    app.post('/api/admin/set', identifyToken, (req, res) => {
        try{
            let tokenInfo = res.locals.tokenInfo;
            let token = tokenInfo.token;
            if (!tokenInfo || tokenInfo.type !== 'admin')
                res.status(404).send();

            let poll = setPollStep(tokenInfo.id, req.body['step'])

            sendUpdateNotification(tokenInfo.id, token);
            res.status(200).json(poll);
        }
        catch (err){
            Logger.error('error while setting poll step', err);
            res.status(500).json(err);
        }
    })

    app.post('api/admin/reset', identifyToken, (req, res) => {
        try{
            let tokenInfo = res.locals.tokenInfo;
            let token = tokenInfo.token;
            if (!tokenInfo || tokenInfo.type !== 'admin')
                res.status(404).send();

            let poll = setPollStep(tokenInfo.id, req.body['step'])

            sendUpdateNotification(tokenInfo.id, token);
            res.status(200).json(poll);
        }
        catch (err){
            Logger.error('error while setting poll step', err);
            res.status(500).json(err);
        }
    })

    app.post('/api/vote', identifyToken, (req, res) => {
        try {
            let tokenInfo = res.locals.tokenInfo;
            let token = tokenInfo.token;
            if (!tokenInfo || tokenInfo.type !== 'vote')
                res.status(404).send();

            addPollVote(tokenInfo.id, req.body['questionId'], req.body['answers'])
            sendUpdateNotification(tokenInfo.id, token);
            res.status(200).json(success);
        }
        catch(err){
            Logger.error('error while posting vote', err);
            res.status(500).json(err);
        }
    });
}

function identifyToken(req, res: express.Response, next){
    let token = req.body['token'] || req.params['token'];
    if (!token){
        res.status(404).json('Missing token');
    }
    let t = getTokenInfo(token);
    res.locals.tokenInfo = t;
    next();
}