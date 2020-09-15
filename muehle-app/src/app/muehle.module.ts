import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MuehleComponent } from './muehle.component';

@NgModule({
  declarations: [
    MuehleComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [MuehleComponent]
})
export class MuehleModule { }
