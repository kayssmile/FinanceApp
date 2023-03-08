import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared_components/shared.module';
import { AccountComponent } from './account/account.component';
import { ManualTransactionFormComponent } from './account/manual-transaction-form/manual-transaction-form.component';
import { CsvTransactionFormComponent } from './account/csv-transaction-form/csv-transaction-form.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { GraphComponent } from './graph/graph.component';
import { TransactionFormComponent } from './transaction-list/transaction-form/transaction-form.component';

@NgModule({
  declarations: [
    DashboardComponent,
    AccountComponent,
    ManualTransactionFormComponent,
    CsvTransactionFormComponent,
    TransactionListComponent,
    GraphComponent,
    TransactionFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: []
})

export class DashboardModule { }
