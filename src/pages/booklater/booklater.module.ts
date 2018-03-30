import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BooklaterPage } from './booklater';

@NgModule({
  declarations: [
    BooklaterPage,
  ],
  imports: [
    IonicPageModule.forChild(BooklaterPage),
  ],
})
export class BooklaterPageModule {}
