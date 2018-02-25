import { Component } from '@angular/core';
import { HasPoll } from '../has-poll';
import { IPoll } from '../../../../../shared/models/poll';
import { ActivatedRoute } from '@angular/router';
import { PollService } from '../../services/poll.service';
import * as _ from 'lodash';
import { PubnubService } from '../../services/pubnub.service';

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
        pubnub: PubnubService) {
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
}
