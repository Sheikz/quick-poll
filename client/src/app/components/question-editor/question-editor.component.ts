import { Component, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { IQuestion, IAnswer } from '../../../../../shared/models/poll';
import { defaultAnswer } from '../poll-editor/poll-editor.component';
import * as _ from 'lodash';

@Component({
    selector: 'app-question-editor',
    templateUrl: './question-editor.html',
    styleUrls: [ './question-editor.scss' ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => QuestionEditorComponent),
            multi: true
        }
    ]
})
export class QuestionEditorComponent implements ControlValueAccessor {

    question: IQuestion;

    @Input()
    canDeleteQuestion: boolean;

    @Output()
    delete: EventEmitter<void> = new EventEmitter();

    onChange: Function = data => {};

    writeValue(input: IQuestion): void {
        console.log('write', input);
        this.question = input;
        this.onChange(this.question);
    }

    onUpdate() {
        this.onChange(this.question);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
    }
    setDisabledState?(isDisabled: boolean): void {
    }

    onKeyDown(event: KeyboardEvent, question) {
        if (event.key === 'Enter') {
            this.addAnswer(question);
        }
    }

    addAnswer(question: IQuestion) {
        if (this.canAddAnswer()) {
            question.answers.push(_.cloneDeep(defaultAnswer));
        }
    }

    deleteAnswer(answer: IAnswer) {
        this.question.answers.splice(this.question.answers.indexOf(answer), 1);
    }

    canAddAnswer() {
        return _.every(this.question.answers, a => a.answer !== '');
    }

    canDelete(question: IQuestion) {
        return question.answers.length >= 2;
    }

}
