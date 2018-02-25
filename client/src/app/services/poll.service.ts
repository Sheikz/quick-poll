import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPoll, IQuestion } from '../../../../shared/models/poll';

@Injectable()
export class PollService {

    constructor(private http: HttpClient) {

    }

    postPoll(poll) {
        return this.http.post<IPoll>('api/poll', poll);
    }

    getPoll(token) {
        return this.http.get<IPoll>('api/poll/' + token);
    }

    start(token) {
        return this.http.post('api/admin/set', {token: token, step: 0});
    }

    set(token, step) {
        return this.http.post('api/admin/set', {token: token, step: step});
    }

    vote(token, questionId: number , answers: number[]) {
        return this.http.post('api/vote/', {
            token: token,
            questionId: questionId,
            answers: answers
        });
    }

    insertQuestion(token, question: IQuestion) {
        return this.http.post('api/admin/insert', {
            token: token,
            question: question
        });
    }
}
