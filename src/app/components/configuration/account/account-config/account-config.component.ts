import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { FluxStore } from 'src/app/model/flux-store';
import { Account } from 'src/app/shared/types/account';
import { csvMask } from 'src/app/shared/types/csvMask';
import { AccountFormComponent } from '../account-form/account-form.component';

@Component({
  selector: 'app-account-config',
  templateUrl: './account-config.component.html'
})

export class AccountConfigComponent implements OnInit, OnDestroy {
  @ViewChild('accountModal') accountModal!: AccountFormComponent

  accounts: Account[] = []
  csvMasks: csvMask[] = []
  subscriptions : Subscription[] = []
  accountForForm?: Account
  selector : string | undefined
  data : string = 'isloading'

  constructor(public store: FluxStore) {}

  ngOnInit() {
    this.subscriptions.push(this.store.Accounts.subscribe((data) => {
      if (data.length) {
        this.accounts = data;
        this.data = 'data'
      }
      if (data.length === undefined) {
        this.data = 'isloading'
      }
      if (data.length === 0){
        this.data = 'nodata'
        this.accounts = []
      }
    }))
    this.subscriptions.push(this.store.CsvMasks.subscribe((data) => {
      if (data.length) {
        this.csvMasks = data
      }
    }))
  }

  createAccount() {
    this.accountForForm = undefined
    if (this.accounts.length > 7) {
      this.selector = "warning"
    }
    if (this.accounts.length < 8) {
      this.selector = "create"
    }
    this.accountModal.modal.nativeElement.classList.add('is-active')
  }

  editAccount(account: Account) {
    this.accountForForm = account
    this.selector = "edit"
    this.accountModal.modal.nativeElement.classList.add('is-active')
  }

  deleteAccount(account: Account) {
    this.selector = "delete"
    this.accountForForm = account
    this.accountModal.modal.nativeElement.classList.add('is-active')
  }

  csvNameFor(account: Account) {
    return this.csvMasks.find(csv => csv.id === account.csv)?.name
  }

  ngOnDestroy() {
    this.subscriptions?.forEach((subscription) => {subscription.unsubscribe()})
  }
}
