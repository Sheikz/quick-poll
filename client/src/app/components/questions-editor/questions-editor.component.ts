import { Component, OnInit } from '@angular/core';
import { IQuestion, IAnswer, IPoll, IPollStatus } from '../../../../../shared/models/poll';
import * as _ from 'lodash';
import { PollService } from '../../services/poll.service';

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
    templateUrl: './questions-editor.html'
})
export class QuestionsEditorComponent implements OnInit {

    public poll: IPoll = {
        questions: [_.cloneDeep(defaultQuestion)]
    };

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

    save() {
        console.log('save', this.poll);
        this.pollService.postPoll(this.poll).subscribe(response => {
            this.poll = response;
        });
    }
}
