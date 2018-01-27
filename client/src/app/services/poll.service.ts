import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PollService {

    constructor(private http: HttpClient) {

    }

    postPoll(poll) {
        this.http.post('api/poll', poll).subscribe(response => {
            console.log('response', response);
        });
    }
}
