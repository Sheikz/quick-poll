"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../auth/auth");
const NodeCache = require("node-cache");
const livePolls = {};
let id = 0;
const cache = new NodeCache({
    stdTTL: 1000 * 60 * 24
});
function createPoll(poll) {
    let currentId = id++;
    poll.id = currentId;
    poll.links = auth_1.generateLinks(currentId);
    poll.status = {
        state: 'NOT_STARTED',
        step: 0
    };
    cache.set(currentId, poll);
    return poll;
}
exports.createPoll = createPoll;
function savePoll(poll) {
    cache.set(poll.id, poll);
    return poll;
}
function getPoll(id) {
    return cache.get(id);
}
exports.getPoll = getPoll;
function resetResults(id, step) {
}
exports.resetResults = resetResults;
function setPollStep(id, step) {
    let poll = cache.get(id);
    if (step == 0) {
        resetPoll(poll);
    }
    poll.status.step = step;
    return savePoll(poll);
    ;
}
exports.setPollStep = setPollStep;
function resetPoll(poll) {
    poll.status.state = 'STARTED';
    poll.status.step = 0;
    poll.questions.forEach(q => q.answers.forEach(a => a.votes = 0));
}
function endPoll(id) {
    let poll = cache.get(id);
    poll.status.step = 0;
    poll.status.state = 'FINISHED';
    return savePoll(poll);
}
exports.endPoll = endPoll;
function addPollVote(pollId, questionId, answers) {
    let poll = cache.get(pollId);
    answers.forEach(a => {
        poll.questions[questionId].answers[a].votes = poll.questions[questionId].answers[a].votes + 1;
    });
    return savePoll(poll);
}
exports.addPollVote = addPollVote;
