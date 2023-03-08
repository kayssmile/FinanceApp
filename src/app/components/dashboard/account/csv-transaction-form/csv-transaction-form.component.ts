import { Component, ElementRef, Inject, Input, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { fluxDispatcherToken } from 'src/app/shared/helpers/flux.configuration';
import { FluxStore } from 'src/app/model/flux-store';
import { Account } from 'src/app/shared/types/account';
import { csvMask } from 'src/app/shared/types/csvMask';
import { FluxAction, FluxActionTypes } from 'src/app/shared/types/actions.type';
import { Category, CategoryGroup } from 'src/app/shared/types/category';
import { Transaction } from 'src/app/shared/types/transaction';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-csv-transaction-form',
  templateUrl: './csv-transaction-form.component.html',
  styleUrls: ['./csv-transaction-form.component.scss']
})

export class CsvTransactionFormComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('modal') modal!: ElementRef
  @ViewChild('subcategoryModal') subcategoryModal!: ElementRef
  @ViewChild('subcategoryInput') subcategoryInput!: ElementRef
  @ViewChild('categoryInput') categoryInput!: ElementRef
  @ViewChild('csvInput') csvInput!: ElementRef
  @ViewChild('csvInputControl') csvInputControl!: ElementRef
  @ViewChild('categoryColumns') categoryColumns!: ElementRef
  @ViewChild('csvInfo') csvInfo!: ElementRef
  @ViewChild('csvReset') csvReset!: ElementRef
  @ViewChild('invalidInfo') invalidInfo!: ElementRef
  @ViewChildren('tags') tags!: QueryList<ElementRef>

  @ViewChild('accountIsReady') accountIsReadyElement!: ElementRef
  @ViewChild('accountNotReady') accountNotReadyElement!: ElementRef

  @Input() account?: Account;

  private subscription : Subscription[] = []
  moment: any = moment;
  categoryGroups: CategoryGroup[] = []
  categories: Category[] = []
  csvMasks: csvMask[] = []
  activeCsvMask: csvMask | undefined
  accounts: Account[] = []
  transactionsToCategorize: Transaction[] = []
  activeTransactionIndex: number = 0
  doneCategorizing: boolean = false
  setCategory: boolean = false
  activeTag: string = ''
  autoAdvance: boolean = false

  constructor(
    @Inject(fluxDispatcherToken) private dispatcher: Subject<FluxAction>,
    private transactionService: TransactionService,
    public store: FluxStore,
    private utilityService: UtilityService
  ) {}

  ngOnInit(){
    this.subscription.push(this.store.CategoryGroups.subscribe((data) => {
      if (data.length > 0) {
        this.categoryGroups = data
      }
    }))
    this.subscription.push(this.store.Categories.subscribe((data) => {
      if (data.length > 0) {
        this.categories = data
        this.categoryGroups = this.utilityService.checkavailableCategories(this.categoryGroups, data)
      }
    }))
    this.subscription.push(this.store.CsvMasks.subscribe((data) => {
      if (data.length > 0) {
        this.csvMasks = data
      }
    }))
    this.subscription.push(this.store.Accounts.subscribe((data) => {
      if (data.length) {
        this.accounts = data
      }
    }))
  }

  hideModal() {
    this.modal.nativeElement.classList.remove('is-active')
    this.removeSelectedTags()
    this.resetForm()
  }

  resetForm() {
    this.csvInput.nativeElement.removeAttribute('disabled')
    this.csvInput.nativeElement.value = ''
    this.csvInputControl.nativeElement.classList.remove('is-loading')
    this.csvInputControl.nativeElement.classList.remove('is-hidden')
    this.csvReset.nativeElement.classList.add('is-hidden')
    this.invalidInfo.nativeElement.classList.add('is-hidden')
    this.categoryColumns.nativeElement.classList.add('is-hidden')
  }

  computeCsvData(e: Event) {
    let msgEvent = e as MessageEvent;
    let transactions = msgEvent.data.split(/\r?\n/)
    this.csvInputControl.nativeElement.classList.add('is-loading')
    this.csvInput.nativeElement.setAttribute('disabled', 'disabled')
    this.transactionsToCategorize = this.transactionService.cookTransactions(transactions, this.activeCsvMask!)
    this.activeTransactionIndex = 0
    this.doneCategorizing = false
    if (this.transactionsToCategorize.length) {
      this.csvInputControl.nativeElement.classList.add('is-hidden')
      this.categoryColumns.nativeElement.classList.remove('is-hidden')
    } else {
      this.csvReset.nativeElement.classList.remove('is-hidden')
      this.invalidInfo.nativeElement.classList.remove('is-hidden')
    }
  }

  addCategory(category: CategoryGroup) {
    this.subcategoryModal.nativeElement.classList.add('is-active')
    this.subcategoryInput.nativeElement.value = ''
    this.subcategoryInput.nativeElement.focus()
    this.categoryInput.nativeElement.value = category.id
  }

  submitCategoryForm(e: Event) {
    e.preventDefault();
    if (this.subcategoryInput.nativeElement.value &&  this.categoryInput.nativeElement.value) {
      let category: Category = {name : this.subcategoryInput.nativeElement.value, group_id: this.categoryInput.nativeElement.value, id: ""}
      this.dispatcher.next(new FluxAction(FluxActionTypes.Create, 'category', null, null, category))
    }
    this.subcategoryModal.nativeElement.classList.remove('is-active')
  }

  hideSubcategoryModal(e: Event) {
    e.preventDefault();
    this.subcategoryModal.nativeElement.classList.remove('is-active')
  }

  removeSelectedTags() {
    this.tags.forEach(tag => { tag.nativeElement.classList.remove('selected')});
  }

  SetTag(e: Event) {
    let target = e.target as HTMLElement
    target.classList.add('selected')
  }

  setCategoryForActiveTransaction(category: Category, e: Event) {
    this.removeSelectedTags()
    this.transactionsToCategorize[this.activeTransactionIndex].categoryId = category.id
    this.setCategory = true;
    this.SetTag(e)
    if (this.autoAdvance) {
      this.setTransaction()
    }
  }

  setTransferCategoryForActiveTransaction(transferAcc: Account, e: Event) {
    this.removeSelectedTags()
    this.transactionsToCategorize[this.activeTransactionIndex].fromAccount = transferAcc.id
    this.transactionsToCategorize[this.activeTransactionIndex].categoryId = "ACCOUNT_TRANSFER"
    this.setCategory = true
    this.SetTag(e)
    if (this.autoAdvance) {
      this.setTransaction()
    }
  }

  setTransaction() {
    if (this.activeTransactionIndex >= this.transactionsToCategorize.length-1) {
      this.doneCategorizing = true
    }
    if (this.activeTransactionIndex < this.transactionsToCategorize.length-1) {
      this.activeTransactionIndex++
      this.setCategory = false
    }
  }

  deleteTransaction() {
    this.transactionsToCategorize.splice(this.activeTransactionIndex, 1);
    if (this.transactionsToCategorize.length === 0) {
      this.doneCategorizing = true
    }
  }

  saveTransactionsToAccount() {
    if (this.account) {
      this.transactionsToCategorize.forEach(transaction => {
        transaction.id = uuidv4()
      })
      this.account.transactions.push(...this.transactionsToCategorize)
      this.account.currentValue = Number(this.utilityService.calculateCurrentValue(this.account))
      this.dispatcher.next(new FluxAction(FluxActionTypes.Update,'account', null, null, null, this.account))
      this.hideModal()
    }
  }

  getCategoryName(transaction: Transaction) {
    if (transaction.categoryId !== 'ACCOUNT_TRANSFER') {
      return this.categories.find(c => c.id === transaction.categoryId)?.name
    } else {
      return this.accounts.find(acc => acc.id === transaction.fromAccount)?.name
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['account'].currentValue) {
      this.activeCsvMask = this.csvMasks.find(m => m.id === this.account?.csv)
      if (this.activeCsvMask !== undefined && this.transactionService.resolveCsvMask(this.activeCsvMask!)) {
        this.accountIsReadyElement.nativeElement.classList.remove('is-hidden')
        this.accountNotReadyElement.nativeElement.classList.add('is-hidden')
      } else {
        this.accountIsReadyElement.nativeElement.classList.add('is-hidden')
        this.accountNotReadyElement.nativeElement.classList.remove('is-hidden')
      }
    }
  }

  ngOnDestroy() {
    this.subscription?.forEach((subscription) => {subscription.unsubscribe()})
  }
}
