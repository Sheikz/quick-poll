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
const pubnub = require("pubnub");
const config_1 = require("../../config/config");
const logger_1 = require("../../logger/logger");
const poll_1 = require("../poll/poll");
const pub = new pubnub({
    subscribeKey: process.env.subscribeKey || config_1.config.pubnub.subscribeKey,
    publishKey: process.env.publishKey || config_1.config.pubnub.publishKey,
    secretKey: process.env.secretKey || config_1.config.pubnub.secretKey
});
function publish(message, channel) {
    return pub.publish({
        message: message,
        channel: channel,
    }).then(response => {
        logger_1.Logger.info('published msg', { response, channel });
    }).catch(err => {
        logger_1.Logger.error('error while publishing message', err);
    });
}
exports.publish = publish;
function sendUpdateNotification(id, token) {
    return __awaiter(this, void 0, void 0, function* () {
        let poll = yield poll_1.getPoll(id);
        logger_1.Logger.info('sending poll update to admins', poll);
        publish({
            event: 'POLL_UPDATED',
            poll: poll
        }, poll.id + 'a');
        poll.questions.forEach(q => {
            q.answers.forEach(a => a.votes = 0);
        });
        logger_1.Logger.info('sending poll update to voters', poll);
        return publish({
            event: 'POLL_UPDATED',
            poll: poll
        }, poll.id + 'v');
    });
}
exports.sendUpdateNotification = sendUpdateNotification;
