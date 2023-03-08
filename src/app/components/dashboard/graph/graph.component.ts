import { AfterViewInit, Component, ElementRef, Inject, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { fluxDispatcherToken } from 'src/app/shared/helpers/flux.configuration';
import { FluxStore } from 'src/app/model/flux-store';
import { Account } from 'src/app/shared/types/account';
import { FluxAction } from 'src/app/shared/types/actions.type';
import { GraphService } from 'src/app/shared/services/graph.service';

import * as echarts from 'echarts';
import { Category, CategoryGroup } from 'src/app/shared/types/category';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})

export class GraphComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() accounts: Account[] = []
  @Input() selectedTimes: string[] = []
  @Input() categoryGroups: CategoryGroup[] = []
  @Input() categories: Category[] = []

  @ViewChild('inout') inoutElement!: ElementRef
  @ViewChild('inoutmobile') inoutMobileElement!: ElementRef
  @ViewChild('categorized') catElement!: ElementRef

  private subscriptions: Subscription[] = [];
  graph: echarts.ECharts | null = null
  inout: echarts.ECharts | null = null
  inoutmobile: echarts.ECharts | null = null
  categorized: echarts.ECharts | null = null
  activeMonths: Set<string> = new Set
  no_transactions: boolean = true

  constructor(
    @Inject(fluxDispatcherToken) private dispatcher: Subject<FluxAction>,
    public store: FluxStore,
    private graphService: GraphService
  ) {}

  resizeGraphs() {
    this.graph?.resize()
    this.inout?.resize()
    this.categorized?.resize()
    this.inoutmobile?.resize()
  }

  ngAfterViewInit() {
    if (!this.no_transactions) {
      this.change_chart()
    }
  }

  change_chart() {
    this.inout = echarts.init(this.inoutElement.nativeElement)
    this.inoutmobile = echarts.init(this.inoutMobileElement.nativeElement)
    this.categorized = echarts.init(this.catElement.nativeElement)
  }

  transactionsAvailable() {
    this.accounts.forEach( account => {
      if (account.transactions.length > 0) {
        this.no_transactions = false
      } else {
        this.no_transactions = true
      }
    })
  }

  ngOnChanges() {
    if (this.accounts.length === 0 ) {
      this.no_transactions = true
    } else {
      this.transactionsAvailable()
    }
    let inoutOptions = this.graphService.composeOptionsInOut(this.accounts, this.selectedTimes)
    let inoutMobileOptions = this.graphService.composeOptionsInOut(this.accounts, this.selectedTimes, true)
    let categorizedOptions = this.graphService.composeOptionsCategorized(this.accounts, this.selectedTimes, this.categoryGroups, this.categories)
    this.inout?.setOption(inoutOptions, true)
    this.inoutmobile?.setOption(inoutMobileOptions, true)
    this.categorized?.setOption(categorizedOptions, true)
    if(!this.no_transactions) {
      this.change_chart()
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {subscription.unsubscribe()})
  }

}
