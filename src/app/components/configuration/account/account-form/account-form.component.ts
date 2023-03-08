import { Component, ElementRef, Inject, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { fluxDispatcherToken } from 'src/app/shared/helpers/flux.configuration';
import { FluxStore } from 'src/app/model/flux-store';
import { Account, AccountColors } from 'src/app/shared/types/account';
import { csvMask } from 'src/app/shared/types/csvMask';
import { FluxAction, FluxActionTypes } from 'src/app/shared/types/actions.type';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html'
})

export class AccountFormComponent implements OnInit, OnChanges {
  @ViewChild('modal', { static: false }) modal!: ElementRef

  @Input() account: Account | undefined
  @Input() selector: string | undefined
  csvMasks: csvMask[] | undefined
  subscription : Subscription | undefined

  accountColors = AccountColors
  accountForm!: FormGroup
  name!: FormControl
  shortName!: FormControl
  description!: FormControl
  initialValue!: FormControl
  color!: FormControl
  csv!: FormControl

  constructor(@Inject(fluxDispatcherToken) private dispatcher: Subject<FluxAction>,
   public store: FluxStore, private utilityService: UtilityService) {}

  ngOnInit() {
    this.accountForm = new FormGroup({
      name: this.name = new FormControl(''),
      shortName: this.shortName = new FormControl('', [
        Validators.required,
        Validators.maxLength(8)
      ]),
      description: this.description = new FormControl(''),
      initialValue: this.initialValue = new FormControl(''),
      color: this.color = new FormControl(''),
      csv: this.csv = new FormControl(''),
    })
    this.subscription = this.store.CsvMasks.subscribe((data) => {
      if (data.length) {
        this.csvMasks = data;
      }
      if(data.length === 0){
        this.csvMasks = []
      }
    })
  }

  hideModal() {
    this.accountForm.reset();
    this.modal.nativeElement.classList.remove('is-active');
  }

  submitAccountForm(e: Event) {
    e.preventDefault();
    if (this.accountForm.valid) {
      let account : Account = this.accountForm.value
      if (this.account) {
        account.id = this.account.id
        account.transactions = this.account.transactions || []
        account.currentValue = Number(this.utilityService.calculateCurrentValue(account))
        this.dispatcher.next(new FluxAction(FluxActionTypes.Update,'account', null, null, null, account))
      }
      if (!this.account) {
        account.currentValue = this.initialValue.value
        account.transactions = []
        this.dispatcher.next(new FluxAction(FluxActionTypes.Create,'account', null, null, null, account))
      }
      this.hideModal()
    }
  }

  deleteAccount() {
    this.dispatcher.next(new FluxAction(FluxActionTypes.Delete,'account', null, null, null, this.account))
    this.hideModal();
  }

  ngOnChanges() {
    if (this.account) {
      this.accountForm.markAllAsTouched()
      this.accountForm?.patchValue(this.account!)
    }
    if (!this.account) {
      this.accountForm?.reset()
    }
  }
}
