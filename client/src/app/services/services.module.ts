import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PollService } from './poll.service';
import { HttpClientModule } from '@angular/common/http';
import { PubnubService } from './pubnub.service';

const services = [
  PollService,
  PubnubService
];

@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [services],
})
export class ServicesModule { }
