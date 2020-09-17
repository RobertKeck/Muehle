import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MuehleComponent } from './muehle.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MuehleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [MuehleComponent]
})
export class MuehleModule { }
