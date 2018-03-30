import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentApprovalPage } from './payment-approval';

@NgModule({
  declarations: [
    PaymentApprovalPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentApprovalPage),
  ],
})
export class PaymentApprovalPageModule {}
