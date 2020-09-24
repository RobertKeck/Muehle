import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MuehleComponent } from './muehle.component';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

@NgModule({
  declarations: [
    MuehleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [MuehleComponent]
})
export class MuehleModule { }

