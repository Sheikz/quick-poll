import * as pubnub from 'pubnub';
import { config } from '../../config/config';
import { Logger } from '../../logger/logger';
import { Connection } from '../database/connector';
import { getPoll } from '../poll/poll';
import { generateId } from '../auth/auth';

const pub = new pubnub({
    subscribeKey: config.pubnub.subscribeKey,
    publishKey: config.pubnub.publishKey,
    secretKey: config.pubnub.secretKey
})

export function publish(message, channel){

    pub.publish({
        message: message,
        channel: channel,
    }).then(response => {
        Logger.info('published msg', {response, channel});
    }).catch(err => {
        Logger.error('error while publishing message', err);
    });
}

export function sendUpdateNotification(id, token){
    let poll = getPoll(id);

    Logger.info('sending update for poll: '+id);
    publish({
        event: 'POLL_UPDATED',
        poll: poll
    }, ''+poll.id);

}