import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { fluxDispatcherToken } from 'src/app/shared/helpers/flux.configuration';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { FluxStore } from 'src/app/model/flux-store';
import { Account } from 'src/app/shared/types/account';
import { FluxAction, FluxActionTypes } from 'src/app/shared/types/actions.type';
import { Category, CategoryGroup } from 'src/app/shared/types/category';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('dashboardFilter') dashboardFilter!: ElementRef
  @ViewChild('filterToggle') settingsBtn!: ElementRef

  private subscription: Subscription[] = []
  accounts: Account[] = []
  categoryGroups: CategoryGroup[] = []
  categories: Category[] = []
  activeAccounts: Account[] = []
  loading_state: string | undefined
  groupedMonths: any[] = []
  selectedTimeframe: string = 'months'
  selectedTime: any[] = []

  constructor(
    @Inject(fluxDispatcherToken) private dispatcher: Subject<FluxAction>,
    private transactionService: TransactionService,
    public store: FluxStore,
  ){}

  ngOnInit() {
    this.dispatcher.next(new FluxAction(FluxActionTypes.Load))
    this.subscription.push(this.store.Accounts.subscribe((data) => {
      if (data.length > 0) {
        this.loading_state = 'loaded'
        this.accounts = data
        this.activeAccounts = data
        this.groupedMonths = this.transactionService.extractMonths(this.activeAccounts)
        this.toggleTimeframe(true)
      }
      if (data.length === undefined) {
         this.loading_state = 'isloading'
      }
      if (data.length === 0){
        this.loading_state = 'nodata'
        this.accounts = []
      }
    }))
    this.subscription.push(this.store.CategoryGroups.subscribe((data) => {
      if (data.length > 0) {
        this.categoryGroups = data
      }
    }))
    this.subscription.push(this.store.Categories.subscribe((data) => {
      if (data.length > 0) {
        this.categories = data
      }
    }))
  }

  toggleFilter(e: Event) {
    e.preventDefault()
    this.dashboardFilter.nativeElement.classList.toggle('hidden')
    this.settingsBtn.nativeElement.classList.toggle('hidden')
  }

  toggleAccount(account: Account) {
    if (this.activeAccounts.includes(account)) {
      this.activeAccounts = this.activeAccounts.filter(a => a != account)
    } else {
      this.activeAccounts = [...this.activeAccounts, account]
    }
    this.groupedMonths = this.transactionService.extractMonths(this.activeAccounts)
  }

  toggleYear(year: string) {
    if (this.selectedTimeframe === 'years') {
      if (this.selectedTime.includes(year)) {
        this.selectedTime = this.selectedTime.filter(y => y != year)
      } else {
        this.selectedTime = [...this.selectedTime, year]
      }
    }
  }

  toggleMonth(month: string) {
    if (this.selectedTimeframe === 'months') {
      if (this.selectedTime.includes(month)) {
        this.selectedTime = this.selectedTime.filter(s => s != month).sort()
      } else {
        this.selectedTime = [...this.selectedTime, month].sort()
      }
    }
  }

  toggleTimeframe(setToMonths: boolean = false) {
    if (this.selectedTimeframe === 'months' && !setToMonths) {
      this.selectedTimeframe = 'years'
      this.selectedTime = this.groupedMonths.map(group => group.at(0).split('.').at(-1))
    } else {
      this.selectedTimeframe = 'months'
      this.selectedTime = this.groupedMonths.flat()
    }
  }

  ngOnDestroy() {
    this.subscription.forEach((subscription) => {subscription.unsubscribe()})
  }
}
