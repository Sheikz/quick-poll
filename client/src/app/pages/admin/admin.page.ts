import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HasPoll } from '../has-token';
import { PollService } from '../../services/poll.service';
import { PubNubAngular } from 'pubnub-angular2';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.html',
    styleUrls: [ './admin.scss']
})
export class AdminPageComponent extends HasPoll {

    constructor(
        router: ActivatedRoute,
        protected pollService: PollService,
        pubnub: PubNubAngular) {
        super(router, pollService, pubnub);
    }

    start() {
        this.pollService.start(this.token).subscribe(r => {
            console.log('started', r);
        });
    }

    next() {
        this.pollService.set(this.token, this.poll.status.step + 1).subscribe(n => {
            console.log('nexted', n);
        });
    }

    previous() {
        this.pollService.set(this.token, this.poll.status.step - 1).subscribe(n => {
            console.log('nexted', n);
        });
    }

    hasNext() {
        return this.currentStep < this.poll.questions.length - 1;
    }

    hasPrevious() {
        return this.currentStep > 0;
    }

    shouldUpdate(event) {
        return !!event.channel.match(/.*a$/);
    }

    getChannels() {
        return [{
            name: this.poll.id + 'a',
            presence: false
        },
        {
            name: this.poll.id + 'v',
            presence: true
        }];
    }

}
