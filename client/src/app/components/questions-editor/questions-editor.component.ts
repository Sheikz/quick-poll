import { Component, OnInit } from '@angular/core';
import { IQuestion, IAnswer, IPoll, IPollStatus } from '../../../../../shared/models/poll';
import * as _ from 'lodash';
import { PollService } from '../../services/poll.service';
import * as copyToClipboard from 'copy-text-to-clipboard';

const defaultAnswer: IAnswer = {
    answer: '',
    votes: 0
};

const defaultQuestion: IQuestion = {
    question: '',
    answers: [defaultAnswer],
    multiple: false
};

@Component({
    selector: 'app-questions-editor',
    templateUrl: './questions-editor.html',
    styleUrls: [ './questions-editor.scss']
})
export class QuestionsEditorComponent implements OnInit {

    public poll: IPoll = {
        questions: [_.cloneDeep(defaultQuestion)]
    };

    copied: string;
    ngLinks = {};

    constructor(private pollService: PollService) {}

    ngOnInit() {
    }

    addQuestion() {
        console.log('default question', defaultQuestion);
        this.poll.questions.push(_.cloneDeep(defaultQuestion));
    }

    addAnswer(question: IQuestion) {
        question.answers.push(_.cloneDeep(defaultAnswer));
    }

    deleteAnswer(answer: IAnswer) {
        this.poll.questions.forEach(q => {
            q.answers.splice(q.answers.indexOf(answer), 1);
        });
    }

    onKeyDown(event: KeyboardEvent, question) {
        if (event.key === 'Enter') {
            this.addAnswer(question);
        }
    }

    save() {
        console.log('save', this.poll);
        this.pollService.postPoll(this.poll).subscribe(response => {
            this.poll = response;
            this.ngLinks = {
                vote: `vote/${this.getToken(this.poll.links.vote)}`,
                admin: `admin/${this.getToken(this.poll.links.admin)}`,
                results: `results/${this.getToken(this.poll.links.results)}`,
            };
        });
    }

    copy(text) {
        copyToClipboard(text);
        this.copied = text;
    }

    getToken(input) {
        return /.*\/(.*$)/.exec(input)[1];
    }
}
