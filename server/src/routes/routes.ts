import * as express from 'express';
import { Logger } from '../logger/logger';
import { getPoll, setPollStep, addPollVote, createPoll, insertQuestion } from '../services/poll/poll';
import { generateLinks, decrypt, getTokenInfo } from '../services/auth/auth';
import * as _ from 'lodash';

const success = {
    message: 'OK'
}

export function initRoutes(app: express.Express){

    app.post('/api/poll', async (req, res) => {

        try {
            let poll = await createPoll(req.body);
            res.json(poll);
        }
        catch(err){
            Logger.error('Error while creating poll', err);
            res.status(500).json(err);
        }
    });

    app.get('/api/poll/:token', identifyToken, async (req, res) => {

        try {
            let tokenInfo = res.locals.tokenInfo;
            let token = tokenInfo.token;
            if (!tokenInfo)
                res.status(404).send();

            Logger.info('tokenInfo', tokenInfo);

            let poll = await getPoll(tokenInfo.id);

            // Do not send results to voters
            if (tokenInfo.type === 'v'){
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

    app.post('/api/admin/set', identifyToken, async (req, res) => {
        try{
            let tokenInfo = res.locals.tokenInfo;
            let token = tokenInfo.token;
            if (!tokenInfo || tokenInfo.type !== 'a')
                res.status(404).send();

            let poll = await setPollStep(tokenInfo.id, req.body['step'])

            res.status(200).json(poll);
        }
        catch (err){
            Logger.error('error while setting poll step', err);
            res.status(500).json(err);
        }
    })

    app.post('/api/admin/reset', identifyToken, async (req, res) => {
        try{
            let tokenInfo = res.locals.tokenInfo;
            let token = tokenInfo.token;
            if (!tokenInfo || tokenInfo.type !== 'a')
                res.status(404).send();

            let poll = await setPollStep(tokenInfo.id, req.body['step'])

            res.status(200).json(poll);
        }
        catch (err){
            Logger.error('error while setting poll step', err);
            res.status(500).json(err);
        }
    })

    app.post('/api/admin/insert', identifyToken, async(req, res) => {
        try{
            console.log('here');
            let tokenInfo = res.locals.tokenInfo;
            let token = tokenInfo.token;
            if (!tokenInfo || tokenInfo.type !== 'a')
                res.status(404).send();

            let poll = await insertQuestion(tokenInfo.id, req.body['question']);
            res.status(200).json(poll);
        } catch(err) {
            Logger.error('Error while inserting question', err);
            res.status(500).json(err);
        }
    })

    app.post('/api/vote', identifyToken, async (req, res) => {
        try {
            let tokenInfo = res.locals.tokenInfo;
            let token = tokenInfo.token;
            if (!tokenInfo || tokenInfo.type !== 'v')
                res.status(404).send();

            await addPollVote(tokenInfo.id, req.body['questionId'], req.body['answers'])
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