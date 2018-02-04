import * as pubnub from 'pubnub';
import { config } from '../../config/config';
import { Logger } from '../../logger/logger';
import { Connection } from '../database/connector';
import { getPoll } from '../poll/poll';
import { generateId } from '../auth/auth';

const pub = new pubnub({
    subscribeKey: process.env.subscribeKey || config.pubnub.subscribeKey,
    publishKey: process.env.publishKey || config.pubnub.publishKey,
    secretKey: process.env.secretKey || config.pubnub.secretKey
})

export function publish(message, channel){

    return pub.publish({
        message: message,
        channel: channel,
    }).then(response => {
        Logger.info('published msg', {response, channel});
    }).catch(err => {
        Logger.error('error while publishing message', err);
    });
}

export async function sendUpdateNotification(id, token){
    let poll = await getPoll(id);

    Logger.info('sending poll update to admins', poll);
    publish({
        event: 'POLL_UPDATED',
        poll: poll
    }, poll.id + 'a');

    poll.questions.forEach(q => {
        q.answers.forEach(a => a.votes = 0);
    })

    Logger.info('sending poll update to voters', poll);
    return publish({
        event: 'POLL_UPDATED',
        poll: poll
    }, poll.id + 'v');

}