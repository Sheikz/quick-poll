import { Component, OnInit } from '@angular/core';
import { IQuestion, IAnswer, IPoll, IPollStatus } from '../../../../../shared/models/poll';
import * as _ from 'lodash';
import { PollService } from '../../services/poll.service';
import * as copyToClipboard from 'copy-text-to-clipboard';

export const defaultAnswer: IAnswer = {
    answer: '',
    votes: 0
};

export const defaultQuestion: IQuestion = {
    question: '',
    answers: [defaultAnswer],
    multiple: false
};

@Component({
    selector: 'app-poll-editor',
    templateUrl: './poll-editor.html',
    styleUrls: [ './poll-editor.scss']
})
export class PollEditorComponent implements OnInit {

    public poll: IPoll = {
        questions: [_.cloneDeep(defaultQuestion)]
    };

    copied: string;
    links = {};

    constructor(private pollService: PollService) {}

    ngOnInit() {
    }

    addQuestion() {
        console.log('default question', defaultQuestion);
        this.poll.questions.push(_.cloneDeep(defaultQuestion));
    }

    save() {
        console.log('save', this.poll);
        this.pollService.postPoll(this.poll).subscribe(response => {
            this.poll = response;
            this.links = this.poll.links;
        });
    }

    canAddQuestion() {
        const latestQuestion = this.poll.questions[this.poll.questions.length - 1];
        return _.every(this.poll.questions, q =>
            q.question !== '' &&
            q.answers.length >= 2 &&
            _.every(q.answers, a => a.answer !== '')
        );
    }

    canCreatePoll() {
        return this.canAddQuestion() && this.poll.questions.length >= 1;
    }

    canDelete() {
        return this.poll.questions.length >= 2;
    }

    delete(question) {
        this.poll.questions.splice(this.poll.questions.indexOf(question), 1);
    }

}
