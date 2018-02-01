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

    constructor(
        router: ActivatedRoute,
        protected pollService: PollService,
        pubnub: PubNubAngular) {
        super(router, pollService, pubnub);
    }

    protected init(token) {
        this.pollService.getPoll(token).subscribe(poll => {
            this.poll = poll;
            this.setPubNub();
            this.update();
        });
    }

    onUpdate() {
        this.totalVotes = _.reduce(this.question.answers, (r, d) => r + d.votes, 0);
        this.question.answers.forEach(answer => {
            answer['width'] = (answer.votes) / this.totalVotes * 100;
            answer['width'] += '%';
        });
    }

}
