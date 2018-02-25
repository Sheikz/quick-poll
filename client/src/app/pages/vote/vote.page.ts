import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HasPoll } from '../has-poll';
import { PollService } from '../../services/poll.service';
import { IPoll, IQuestion, IAnswer } from '../../../../../shared/models/poll';
import { PubNubAngular } from 'pubnub-angular2';
import { PubnubService } from '../../services/pubnub.service';

@Component({
    selector: 'app-vote',
    templateUrl: './vote.html',
    styleUrls: [ './vote.scss' ]
})
export class VotePageComponent extends HasPoll {

    poll: IPoll;
    answered = false;
    selected: number;
    presenceEnabled = true;

    constructor(
        router: ActivatedRoute,
        protected pollService: PollService,
        pubnub: PubnubService) {
        super(router, pollService, pubnub);
    }

    vote(answer: IAnswer, index: number) {
        if (this.answered) {
            return;
        }
        this.selected = index;
        this.answered = true;
        this.pollService.vote(this.token, this.poll.status.step, [index]).subscribe(results => {
            console.log('voted', results);
        });
    }

    onUpdate(changeQuestion: boolean) {
        if (changeQuestion) {
            this.answered = false;
            this.selected = undefined;
        }
    }
}
