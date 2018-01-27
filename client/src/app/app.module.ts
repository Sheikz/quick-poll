import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { QuestionsEditorComponent } from './components/questions-editor/questions-editor.component';
import { ServicesModule } from './services/services.module';

const components = [
  QuestionsEditorComponent
];

@NgModule({
  declarations: [
    AppComponent,
    QuestionsEditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ServicesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
