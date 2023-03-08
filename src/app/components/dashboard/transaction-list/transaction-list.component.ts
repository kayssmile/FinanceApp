import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Subject, Subscription } from 'rxjs';
import { fluxDispatcherToken } from 'src/app/shared/helpers/flux.configuration';
import { FluxStore } from 'src/app/model/flux-store';
import { Account } from 'src/app/shared/types/account';
import { FluxAction } from 'src/app/shared/types/actions.type';
import { Category, CategoryGroup } from 'src/app/shared/types/category';
import { DATE_FORMAT, Transaction } from 'src/app/shared/types/transaction';
import { TransactionFormComponent } from './transaction-form/transaction-form.component';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})

export class TransactionListComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('DetailTransactionModal') DetailTransactionModal!: TransactionFormComponent
  @Input() accounts: Account[] = []
  @Input() selectedTimes: string[] = []

  private subscriptions: Subscription[] = [];
  allTransactions: Transaction[] = []
  allCategories: Category[] = []
  allCategoryGroups: CategoryGroup[] = []
  allAccounts: Account[] = []
  selectedtransaction: Transaction | undefined
  activeMonths: Set<string> = new Set
  no_transactions: boolean = true

  constructor(@Inject(fluxDispatcherToken) private dispatcher: Subject<FluxAction>, public store: FluxStore) {}

  ngOnInit() {
    this.subscriptions.push(this.store.Categories.subscribe((data) => {
      if (data.length) {
        this.allCategories = data
      }
    }))
    this.subscriptions.push(this.store.CategoryGroups.subscribe((data) => {
      if (data.length) {
        this.allCategoryGroups = data
      }
    }))
    this.subscriptions.push(this.store.Accounts.subscribe((data) => {
      if (data.length) {
        this.allAccounts = data
      }
    }))
  }

  openModal(transaction : Transaction) {
    this.selectedtransaction = transaction
    this.selectedtransaction.categoryName = this.categoryNameFor(this.selectedtransaction)
    this.DetailTransactionModal.modaltransaction.nativeElement.classList.add('is-active')
  }

  categoryNameFor(transaction: Transaction) {
    if (transaction.categoryId !== 'ACCOUNT_TRANSFER') {
      return this.allCategories.find(cat => cat.id === transaction.categoryId)?.name
    } else {
      let transferIndicator: string = ''
      if (transaction.amount > 0) {
        transferIndicator += 'from '
      } else {
        transferIndicator += 'to '
      }
      transferIndicator += this.allAccounts.find(acc => acc.id === transaction.fromAccount)?.name
      return transferIndicator
    }
  }

  colorFor(transaction: Transaction) {
    if (transaction.categoryId !== 'ACCOUNT_TRANSFER') {
      return this.allCategoryGroups.find(cg => {
        return cg.id === (this.allCategories.find(c => c.id === transaction.categoryId)?.group_id)
      })?.color
    } else {
      return this.allAccounts.find(acc => acc.id === transaction.fromAccount)?.color
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.allTransactions = []
    this.accounts.forEach(account => {
      if (account.transactions.length > 0) {
        this.no_transactions = false
        let tempTransactions: Transaction[] = [...account.transactions];
        tempTransactions.map(t => {
          t.accountName = account.name
          t.accountShortName = account.shortName
          t.date = t.date
        })
        this.allTransactions.push(...tempTransactions)
      } else {
        this.no_transactions = true
      }
    })
    this.allTransactions = this.allTransactions.filter(t => this.selectedTimes.some((times => t.date.includes(times))))
    this.allTransactions.sort((a,b) => Date.parse(moment(b.date, DATE_FORMAT).toString()) - Date.parse(moment(a.date, DATE_FORMAT).toString()))
    this.activeMonths = new Set(this.allTransactions.map(t => moment(t.date, DATE_FORMAT).format('M.Y')))
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {subscription.unsubscribe()})
  }

}
