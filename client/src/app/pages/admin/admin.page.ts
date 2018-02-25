import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HasPoll } from '../has-poll';
import { PollService } from '../../services/poll.service';
import { PubNubAngular } from 'pubnub-angular2';
import { IPoll } from '../../../../../shared/models/poll';
import { PubnubService } from '../../services/pubnub.service';
import * as _ from 'lodash';
import { defaultQuestion } from '../../components/poll-editor/poll-editor.component';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.html',
    styleUrls: [ './admin.scss']
})
export class AdminPageComponent extends HasPoll {

    question = _.cloneDeep(defaultQuestion);

    constructor(
        router: ActivatedRoute,
        protected pollService: PollService,
        protected pubnub: PubnubService) {
        super(router, pollService, pubnub);
    }

    start() {
        this.pollService.start(this.token).subscribe((r: IPoll) => {
            console.log('started', r);
            this.pollObserver.next(r);
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

    postQuestion() {
        return this.pollService.insertQuestion(this.token, this.question)
        .subscribe(r => this.next());
    }

    canPostQuestion() {
        return this.question.question !== '' &&
        this.question.answers.length >= 2 &&
        _.every(this.question.answers, a => a.answer !== '');
    }

}
