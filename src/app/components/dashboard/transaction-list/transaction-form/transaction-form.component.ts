import { Component, ElementRef, Inject, Input, OnChanges, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { fluxDispatcherToken } from 'src/app/shared/helpers/flux.configuration';
import { FluxStore } from 'src/app/model/flux-store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Account } from 'src/app/shared/types/account';
import { FluxAction, FluxActionTypes } from 'src/app/shared/types/actions.type';
import { Category, CategoryGroup } from 'src/app/shared/types/category';
import { Transaction } from 'src/app/shared/types/transaction';
import * as moment from 'moment';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss']
})

export class TransactionFormComponent implements OnInit, OnChanges {
  @ViewChild('modaltransaction') modaltransaction!: ElementRef
  @ViewChild('CategoryName') CategoryName!: ElementRef
  @ViewChild('dateinput') dateinput!: ElementRef
  @ViewChildren('selectabletags') selectabletags!: QueryList<ElementRef>
  @Input() transaction?: Transaction
  @Input() categoryGroups?: CategoryGroup[]
  @Input() categories?: Category[]

  showCategoriesFlag : boolean = false
  account : Account | undefined
  transactionForm!: FormGroup
  id!: FormControl
  description!: FormControl
  date!: FormControl
  categoryName!: FormControl
  amount!: FormControl
  categoryId!: FormControl

  constructor(
    @Inject(fluxDispatcherToken) private dispatcher: Subject<FluxAction>,
    public store: FluxStore,
    private utilityService: UtilityService
  ) {}

  ngOnInit(){
    this.transactionForm = new FormGroup({
      id: this.id = new FormControl(''),
      description: this.description = new FormControl(''),
      date: this.date = new FormControl(''),
      categoryName: this.categoryName = new FormControl(''),
      amount: this.amount = new FormControl('', [
        Validators.required,
        Validators.maxLength(100000000)
      ]),
      categoryId: this.categoryId = new FormControl('')
    })
  }

  getAccountforTransaction() {
    this.store.Accounts.getValue().forEach(account =>{
      if(account.name === this.transaction!.accountName){
        this.account = account
      }
    })
  }

  UpdateAccount() {
    this.dispatcher.next(new FluxAction(FluxActionTypes.Update,'account', null, null, null, this.account!))
  }

  filterchangedTransaction() {
    this.account!.transactions = this.account!.transactions.filter(tran => tran.id !== this.transaction!.id)
  }

  deletetransaction() {
    this.getAccountforTransaction()
    this.filterchangedTransaction()
    this.account!.currentValue = Number(this.utilityService.calculateCurrentValue(this.account!))
    this.UpdateAccount()
    this.hideModal()
  }

  showCategories() {
    this.showCategoriesFlag = !this.showCategoriesFlag
  }

  setCategory(category : Category, e:Event) {
    this.removeActiveTag()
    this.transactionForm.value.categoryId = category.id
    this.CategoryName.nativeElement.value = category.name;
    let target = e.target as HTMLElement
    target.classList.add('selected')
  }

  removeActiveTag() {
    this.selectabletags.forEach(tag => { tag.nativeElement.classList.remove('selected')});
  }

  updateTransaction() {
    if(this.transactionForm.valid){
      if(this.transactionForm.value.categoryName === undefined){
        this.transactionForm.value.categoryName = null
      }
      this.getAccountforTransaction()
      this.filterchangedTransaction()
      let transaction : Transaction = this.transactionForm.value
      if (this.transaction!.date !== this.transactionForm.value.date) {
        transaction.date = moment(this.transactionForm.value.date, "YYYY-MM-DD").format('DD.MM.YYYY')
      }
      this.account!.transactions.push(transaction)
      if (this.transaction?.amount !== this.transactionForm.value.amount) {
        this.account!.currentValue = Number(this.utilityService.calculateCurrentValue(this.account!))
      }
      this.UpdateAccount()
    }
    this.hideModal()
  }

  hideModal() {
    this.modaltransaction.nativeElement.classList.remove('is-active')
    this.removeActiveTag()
    this.showCategoriesFlag = false
  }

  ngOnChanges() {
    if (this.transaction) {
      this.CategoryName.nativeElement.value = this.transaction.categoryName
      this.transactionForm.markAllAsTouched()
      this.transactionForm?.patchValue(this.transaction)
      this.dateinput.nativeElement.value = moment(this.transaction!.date, "DD.MM.YYYY").format('YYYY-MM-DD')
    }
  }
}
