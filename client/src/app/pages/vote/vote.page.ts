import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HasPoll } from '../has-token';
import { PollService } from '../../services/poll.service';
import { IPoll, IQuestion } from '../../../../../shared/models/poll';
import { PubNubAngular } from 'pubnub-angular2';

@Component({
    selector: 'app-vote',
    templateUrl: './vote.html'
})
export class VotePageComponent extends HasPoll {



    poll: IPoll;

    constructor(
        router: ActivatedRoute,
        protected pollService: PollService,
        pubnub: PubNubAngular) {
        super(router, pollService, pubnub);
    }

    protected init(token: string) {
        this.pollService.getPoll(token).subscribe(poll => {
            this.poll = poll;
            this.setPubNub();
            this.update();
        });
    }

    vote(answer: number) {
        this.pollService.vote(this.token, this.poll.status.step, [answer]).subscribe(results => {
            console.log('voted', results);
        });
    }
}
