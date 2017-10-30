import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CardComponent } from '../card/card.component';

import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-4.x';
import { Cloudinary } from 'cloudinary-core';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent
  ],
  imports: [
    BrowserModule,
    CloudinaryModule.forRoot({Cloudinary}, { cloud_name: 'dc3dnmmpx' } as CloudinaryConfiguration)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
