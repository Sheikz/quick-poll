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
const connector_1 = require("../database/connector");
const auth_1 = require("../auth/auth");
const NodeCache = require("node-cache");
const livePolls = {};
const cache = new NodeCache({
    stdTTL: 1000 * 60 * 24
});
function createPoll(poll) {
    return __awaiter(this, void 0, void 0, function* () {
        let con = yield connector_1.Connection.get();
        poll.status = {
            state: 'NOT_STARTED',
            step: 0
        };
        let result = yield con.query('insert into poll (poll) values (?)', JSON.stringify(poll));
        con.release();
        return yield getPoll(result.insertId);
    });
}
exports.createPoll = createPoll;
function savePoll(poll) {
    cache.set(poll.id, poll);
    return poll;
}
function getPoll(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let poll = cache.get(id);
        if (poll) {
            return poll;
        }
        // If not in cache, get from DB
        let con = yield connector_1.Connection.get();
        let pollJSON = yield con.query('select poll from poll where id = ?', id);
        if (pollJSON.length == 0)
            return null;
        poll = JSON.parse(pollJSON[0].poll);
        poll.id = id;
        poll.links = auth_1.generateLinks(poll.id);
        con.release();
        cache.set(id, poll);
        return poll;
    });
}
exports.getPoll = getPoll;
function resetResults(id, step) {
}
exports.resetResults = resetResults;
function setPollStep(id, step) {
    return __awaiter(this, void 0, void 0, function* () {
        let poll = yield getPoll(id);
        if (step == 0) {
            resetPoll(poll);
        }
        poll.status.step = step;
        return savePoll(poll);
        ;
    });
}
exports.setPollStep = setPollStep;
function resetPoll(poll) {
    poll.status.state = 'STARTED';
    poll.status.step = 0;
    poll.questions.forEach(q => q.answers.forEach(a => a.votes = 0));
}
function endPoll(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let poll = yield getPoll(id);
        poll.status.step = 0;
        poll.status.state = 'FINISHED';
        return savePoll(poll);
    });
}
exports.endPoll = endPoll;
function addPollVote(pollId, questionId, answers) {
    return __awaiter(this, void 0, void 0, function* () {
        let poll = yield getPoll(pollId);
        answers.forEach(a => {
            poll.questions[questionId].answers[a].votes = poll.questions[questionId].answers[a].votes + 1;
        });
        return savePoll(poll);
    });
}
exports.addPollVote = addPollVote;
