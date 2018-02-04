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

const cache: NodeCache.NodeCache = new NodeCache({
    stdTTL: 1000 * 60 * 24
});

export async function createPoll(poll: IPoll){

    let con = await Connection.get();
    poll.status = {
        state: 'NOT_STARTED',
        step: 0
    };
    let result = <any>await con.query('insert into poll (poll) values (?)', JSON.stringify(poll));
    
    con.release();
    
    return await getPoll(result.insertId);
}

function savePoll(poll: IPoll){
    cache.set(poll.id, poll);
    return poll;
}

export async function getPoll(id: number): Promise<IPoll> {
    let poll = cache.get<IPoll>(id);
    if (poll){
        return poll;
    }
    // If not in cache, get from DB
    let con = await Connection.get();
    let pollJSON = await con.query('select poll from poll where id = ?', id);
    if (pollJSON.length == 0)
        return null;

    poll = JSON.parse(pollJSON[0].poll);

    poll.id = id;
    poll.links = generateLinks(poll.id);
    con.release();
    cache.set(id, poll);
    return poll;
}

export function resetResults(id, step){
    
}

export async function setPollStep(id, step){

    let poll = await getPoll(id);
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

export async function endPoll(id){
    let poll = await getPoll(id);
    poll.status.step = 0;
    poll.status.state = 'FINISHED';
    return savePoll(poll);
}

export async function addPollVote(pollId: number, questionId: number, answers: number[]){

    let poll = await getPoll(pollId);

    answers.forEach(a => {
        poll.questions[questionId].answers[a].votes = poll.questions[questionId].answers[a].votes + 1;
    })
    
    return savePoll(poll);
}