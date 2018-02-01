import { OnInit, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPoll, IQuestion } from '../../../../shared/models/poll';
import { PubNubAngular } from 'pubnub-angular2';
import { PollService } from '../services/poll.service';

export abstract class HasPoll implements OnInit {

    protected poll: IPoll;
    protected token: string;

    currentStep: number;
    question: IQuestion;

    constructor(
        private router: ActivatedRoute,
        protected pollService: PollService,
        private pubnub: PubNubAngular,
        ) {}

    ngOnInit() {
        this.router.paramMap.subscribe(params => {
            this.token = params.get('token');
            this.init(this.token);
        });
    }

    protected init(token: string) {
        this.pollService.getPoll(token).subscribe(poll => {
            this.poll = poll;
            this.setPubNub();
        });
    }

    onUpdate() {}

    update() {
        this.currentStep = this.poll.status.step;
        this.question = this.poll.questions[this.currentStep];
        this.onUpdate();
    }

    protected setPubNub() {
        this.pubnub.addListener({
            presence: (presenceEvent) => {
                console.log('presence event', presenceEvent);
            },
            message: (event) => {
                console.log('got message', event);
                this.poll = event.message.poll;
                console.log('updated poll', this.poll);
                this.update();
            }
        });

        this.pubnub.subscribe({
            channels: [this.poll.id],
            withPresence: true
        });
        this.update();
        console.log('subscribed to channel', this.poll.id);
    }

}
