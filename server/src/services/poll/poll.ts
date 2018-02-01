import { IPoll, IPollStatus } from '../../../../shared/models/poll';
import { Connection } from '../database/connector';
import { Logger } from '../../logger/logger';
import * as crypto from 'crypto';
import { generateLinks, generateId } from '../auth/auth';
import { publish } from '../notifications/notifications';
import * as NodeCache from 'node-cache';

const livePolls: {
    [key: number]: IPoll
} = {};

let id = 0;

const cache: NodeCache.NodeCache = new NodeCache({
    stdTTL: 1000 * 60 * 24
});

export function createPoll(poll: IPoll){

    let currentId = id++;
    poll.id = currentId;
    poll.links = generateLinks(currentId)
    poll.status = {
        state: 'NOT_STARTED',
        step: 0
    };
    cache.set(currentId, poll);
    return poll;
}

function savePoll(poll: IPoll){
    cache.set(poll.id, poll);
    return poll;
}

export function getPoll(id: number) {

    return cache.get<IPoll>(id);
}

export function resetResults(id, step){
    
}

export function setPollStep(id, step){

    let poll = cache.get<IPoll>(id);
    if (step == 0){
        resetPoll(poll);
    } 
    poll.status.step = step;

    return savePoll(poll);;
}

function resetPoll(poll: IPoll){
    poll.status.state = 'STARTED';
    poll.status.step = 0;
    poll.questions.forEach(q => q.answers.forEach(a => a.votes = 0));
}

export function endPoll(id){
    let poll = cache.get<IPoll>(id);
    poll.status.step = 0;
    poll.status.state = 'FINISHED';
    return savePoll(poll);
}

export function addPollVote(pollId: number, questionId: number, answers: number[]){

    let poll = cache.get<IPoll>(pollId);

    answers.forEach(a => {
        poll.questions[questionId].answers[a].votes = poll.questions[questionId].answers[a].votes + 1;
    })
    
    return savePoll(poll);
}