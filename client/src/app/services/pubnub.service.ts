import { Observer } from 'rxjs/Observer';
import { PubNubAngular } from 'pubnub-angular2';
import { Injectable } from '@angular/core';

export interface IPresenceEvent {
    join: string;
    actualChannel: string;
    channel: string;
    occupancy: number;
    timestamp: number;
    timetoken: string;
    uuid: string;
}

@Injectable()
export class PubnubService {

    constructor(private pubnub: PubNubAngular) {}

    subscribe(channel, valueObserver: Observer<any>, presenceObserver: Observer<IPresenceEvent>) {
        this.pubnub.addListener({
            presence: (presence) => presenceObserver.next(presence)
        });
        this.pubnub.addListener({
            message: (event) => {
                if (event.message.poll) {
                    valueObserver.next(event.message.poll);
                }
            }
        });
        this.pubnub.subscribe({
            channels: [channel],
            withPresence: true
        });
    }

    unsubscribe(channel) {
        this.pubnub.unsubscribe(channel);
    }
}
