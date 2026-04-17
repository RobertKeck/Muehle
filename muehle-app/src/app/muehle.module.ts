import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MuehleComponent } from './muehle.component';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MuehleComponent
  ],
  providers: [],
  bootstrap: [MuehleComponent]
})
export class MuehleModule { }

