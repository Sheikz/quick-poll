import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { QuestionsEditorComponent } from './components/questions-editor/questions-editor.component';
import { ServicesModule } from './services/services.module';
import { RouterModule } from '@angular/router';
import { AdminPageComponent } from './pages/admin/admin.page';
import { VotePageComponent } from './pages/vote/vote.page';
import { ResultsPageComponent } from './pages/results/results.page';
import { PubNubAngular } from 'pubnub-angular2';
import { CheckboxComponent } from './components/checkbox/checkbox.component';

const components = [
  QuestionsEditorComponent,
  CheckboxComponent
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
    pages
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ServicesModule,

    RouterModule.forRoot(
      [
        { path: '', component: QuestionsEditorComponent },
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
