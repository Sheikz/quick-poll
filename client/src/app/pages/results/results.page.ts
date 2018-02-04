import { Component } from '@angular/core';
import { HasPoll } from '../has-token';
import { IPoll } from '../../../../../shared/models/poll';
import { ActivatedRoute } from '@angular/router';
import { PollService } from '../../services/poll.service';
import { PubNubAngular } from 'pubnub-angular2';
import * as _ from 'lodash';

@Component({
    selector: 'app-results',
    templateUrl: './results.html',
    styleUrls: [ './results.scss']
})
export class ResultsPageComponent extends HasPoll {

    totalVotes: number;
    maxVotes: number;

    constructor(
        router: ActivatedRoute,
        protected pollService: PollService,
        pubnub: PubNubAngular) {
        super(router, pollService, pubnub);
    }

    onUpdate() {
        console.log('onUpdate', this.poll);
        this.totalVotes = _.reduce(this.currentQuestion.answers, (r, d) => r + d.votes, 0);
        this.maxVotes = _.reduce(this.currentQuestion.answers, (r, d) => Math.max(r, d.votes), 0);
        this.currentQuestion.answers.forEach(answer => {
            if (answer.votes === 0 || this.maxVotes === 0) {
                answer['width'] = '0%';
            } else {
                answer['width'] = (answer.votes) / this.maxVotes * 100;
                answer['width'] += '%';
            }

        });
    }

    shouldUpdate(event) {
        return !!event.channel.match(/.*a$/);
    }

    onPresence(event) {
        console.log('presence event', event);
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
