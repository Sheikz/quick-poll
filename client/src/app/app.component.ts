import { Component } from '@angular/core';
import { PubNubAngular } from 'pubnub-angular2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor(private pubnub: PubNubAngular) {
    this.pubnub.init({
      publishKey: 'pub-c-ecf8b336-23c9-4c94-aa52-7cd08da1a898',
      subscribeKey: 'sub-c-79caf1b6-041b-11e8-bd8f-6ec1080ef9b6'
    });

    console.log('pubnub init');

  }
}
