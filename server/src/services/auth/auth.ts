import * as crypto from 'crypto';
import { config } from '../../config/config';
import { Logger } from '../../logger/logger';
import * as _ from 'lodash';

const algorithm = 'aes192'
const linkUrlBase = config.appUrl
const password = config.crypto.password

export function generateLinks(id){
    return {
        vote: `${linkUrlBase}/vote/${encrypt(`vote-${id}`)}`,
        results: `${linkUrlBase}/results/${encrypt(`results-${id}`)}`,
        admin: `${linkUrlBase}/admin/${encrypt(`admin-${id}`)}`,
    };
}

export function generateId(id){
    return encrypt(id);
}

function encrypt(text){
    const cipher = crypto.createCipher(algorithm, password);
    let crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}
   
export function decrypt(text){
    const decipher = crypto.createDecipher(algorithm, password);
    let dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

export function getTokenInfo(token){
    let d = decrypt(token);

    const values = d.split('-');
    if (values.length !== 2 || !['admin', 'results', 'vote'].some(v => v === values[0]))
        return null;

    return {
        type: values[0],
        id: parseInt(values[1]),
        token: token
    }
}