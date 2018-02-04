import { OnInit, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPoll, IQuestion } from '../../../../shared/models/poll';
import { PubNubAngular } from 'pubnub-angular2';
import { PollService } from '../services/poll.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

interface IChannel {
    name: string;
    presence: boolean;
}

export abstract class HasPoll implements OnInit, OnDestroy {

    poll: IPoll;
    token: string;
    currentStep: number;
    currentQuestion: IQuestion;
    votersCount = 0;

    constructor(
        protected router: ActivatedRoute,
        protected pollService: PollService,
        protected pubnub: PubNubAngular,
        ) {}

    ngOnInit() {
        this.router.paramMap.subscribe(params => {
            this.token = params.get('token');
            this.init(this.token);
        });
    }

    ngOnDestroy() {
        this.pubnub.unsubscribeAll();
    }

    protected init(token: string) {
        this.pollService.getPoll(token).subscribe(poll => {
            this.update(poll);
            this.initPubnub();
        });
    } 

    protected initPubnub() {
        this.pubnub.addListener({
            presence: (presenceEvent) => {
                this.onPresence(presenceEvent);
                this.votersCount = Math.max(presenceEvent.occupancy - 2, 0);
            },
            message: (event) => {
                if (this.shouldUpdate(event)) {
                    if (event.message.poll) {
                        this.update(event.message.poll);
                    }
                }
                this.onMessage(event);
            }
        });
        console.log('channels', this.getChannels());
        this.getChannels().forEach(channel => {
            this.pubnub.subscribe({
                channels: [channel.name],
                withPresence: channel.presence
            });
            console.log('subscribed to channel', channel.name);
        });
    }

    private update(poll) {
        let changeQuestion = false;
        this.poll = poll;
        if (this.poll.status.step !== this.currentStep) {
            changeQuestion = true;
        }
        this.currentStep = this.poll.status.step;
        this.currentQuestion = this.poll.questions[this.currentStep];
        this.onUpdate(changeQuestion);
    }

    protected onUpdate(changeQuestion: boolean) {}
    protected onPresence(event) {}
    protected onMessage(message) {}
    abstract getChannels(): IChannel[];
    protected shouldUpdate(event): boolean {
        return true;
    }

}
