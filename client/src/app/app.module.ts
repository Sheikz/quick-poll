import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PollEditorComponent } from './components/poll-editor/poll-editor.component';
import { ServicesModule } from './services/services.module';
import { RouterModule } from '@angular/router';
import { AdminPageComponent } from './pages/admin/admin.page';
import { VotePageComponent } from './pages/vote/vote.page';
import { ResultsPageComponent } from './pages/results/results.page';
import { PubNubAngular } from 'pubnub-angular2';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { ToLetter } from './pipes/to-letter.pipe';
import { QuestionEditorComponent } from './components/question-editor/question-editor.component';
import { LinksComponent } from './components/links/links.component';

const components = [
  PollEditorComponent,
  CheckboxComponent,
  QuestionEditorComponent,
  LinksComponent
];

const pages = [
  AdminPageComponent,
  VotePageComponent,
  ResultsPageComponent
];

@NgModule({
  declarations: [
    AppComponent,
    components,
    pages,
    ToLetter
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ServicesModule,

    RouterModule.forRoot(
      [
        { path: '', component: PollEditorComponent },
        { path: 'admin/:token', component: AdminPageComponent },
        { path: 'vote/:token', component: VotePageComponent },
        { path: 'results/:token', component: ResultsPageComponent },
        { path: '**', redirectTo: ''}
      ],
  )
  ],
  providers: [PubNubAngular],
  bootstrap: [AppComponent]
})
export class AppModule { }
