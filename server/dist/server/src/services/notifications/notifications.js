"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pubnub = require("pubnub");
const config_1 = require("../../config/config");
const logger_1 = require("../../logger/logger");
const poll_1 = require("../poll/poll");
const pub = new pubnub({
    subscribeKey: config_1.config.pubnub.subscribeKey,
    publishKey: config_1.config.pubnub.publishKey,
    secretKey: config_1.config.pubnub.secretKey
});
function publish(message, channel) {
    pub.publish({
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
    let poll = poll_1.getPoll(id);
    logger_1.Logger.info('sending update for poll: ' + id);
    publish({
        event: 'POLL_UPDATED',
        poll: poll
    }, '' + poll.id);
}
exports.sendUpdateNotification = sendUpdateNotification;
