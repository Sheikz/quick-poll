import { OnInit, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPoll, IQuestion } from '../../../../shared/models/poll';
import { PubNubAngular } from 'pubnub-angular2';
import { PollService } from '../services/poll.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import 'rxjs/add/observable/of';
import { PubnubService, IPresenceEvent } from '../services/pubnub.service';
import { ISubscription } from 'rxjs/Subscription';

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

    pollObserver: Observer<IPoll>;
    presenceObserver: Observer<IPresenceEvent>;
    subscriptions: ISubscription[] = [];

    poll$: Observable<IPoll> = Observable.create((observer: Observer<IPoll>) => {
        this.pollObserver = observer;
    });
    presence$: Observable<IPresenceEvent> = Observable.create((observer: Observer<IPresenceEvent>) => this.presenceObserver = observer);

    constructor(
        protected router: ActivatedRoute,
        protected pollService: PollService,
        protected pubnub: PubnubService,
        ) {}

    ngOnInit() {
        this.subscriptions.push(this.poll$.subscribe(poll => {
            this.poll = poll;
            this.update(poll);
        }));
        this.subscriptions.push(this.presence$.subscribe(presence => {
            this.votersCount = Math.max(presence.occupancy - 2, 0);
        }));
        this.router.paramMap.subscribe(params => {
            this.token = params.get('token');
            this.init(this.token);
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.pubnub.unsubscribe(this.poll && this.poll.id);
    }

    protected init(token: string) {
        this.pollService.getPoll(token).subscribe(poll => {
            this.pubnub.subscribe(poll.id, this.pollObserver, this.presenceObserver);
            this.pollObserver.next(poll);
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
}
