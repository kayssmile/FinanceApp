import { Injectable } from '@angular/core';
import { Account } from '../types/account';
import { DATE_FORMAT } from '../types/transaction';
import * as moment from 'moment';
import { Category, CategoryGroup } from '../types/category';

@Injectable({providedIn: 'root'})

export class GraphService {
  constructor() {}

  private setAccountNames(accounts: Account[], mobile: boolean = false) {
    if (mobile) {
      return accounts.map(acc => acc.shortName)
    } else {
      return accounts.map(acc => acc.name)
    }
  }

  private setAccountSeries(accounts: Account[], selectedMonths: string[]) {
    let accGraphObjects: any = accounts.map(acc => {return {
      name: acc.name,
      type: 'line',
      lineStyle: { width: 2 },
      symbol: 'none',
      data: this.setMonthlyTotals(acc, selectedMonths),
      color: acc.color,
    }})
    accGraphObjects.push({
      name: 'Total',
      type: 'line',
      lineStyle: { width: 2, type: 'dotted' },
      symbol: 'none',
      data: this.setMonthlyGrandTotal(accGraphObjects),
      color: 'black',
    })
    return accGraphObjects
  }

  private setMonthlyTotals(account: Account, selectedMonths: string[]) {
    let sortedTransactions = account.transactions.sort((a,b) => Date.parse(moment(a.date, DATE_FORMAT).toString()) - Date.parse(moment(b.date, DATE_FORMAT).toString()))
    let availableMonths = [...new Set(sortedTransactions.map(trans => trans.date.substring(3)))]
    let runningTotal = account.initialValue
    let monthlyTotals: {
      [key: string]: number,
    } = {}
    let flatMonthlyTotals: number[] = []
    availableMonths.forEach((month, i) => {
      monthlyTotals[month] = sortedTransactions.reduce(
        (accumulator, currentValue) => accumulator + (currentValue.date.includes(month) ? currentValue.amount : 0),
        runningTotal
      )
      runningTotal = monthlyTotals[month]
    });
    let lastMonth: number = 0
    selectedMonths.forEach(month => {
      flatMonthlyTotals.push(monthlyTotals[month] || lastMonth)
      lastMonth = flatMonthlyTotals.at(-1) || 0
    })
    return flatMonthlyTotals
  }

  private setMonthlyGrandTotal(accGraphObjects: any[]) {
    let grandTotals: number[] = []
    accGraphObjects.forEach(acc => {
      acc.data.forEach((value: number, i: number) => {
        if (grandTotals[i] == undefined) {grandTotals[i] = 0}
        grandTotals[i] += value
      });
    });
    return grandTotals
  }

  private setAccountInOut(accounts: Account[], selectedMonths: string[]) {
    return [
      {
        name: 'Income',
        type: 'bar',
        stack: 'Total',
        label: {
          show: true,
          position: 'insideTop'
        },
        data: this.setOutData(accounts, selectedMonths),
        color: '#FF2255'
      },
      {
        name: 'Expenses',
        type: 'bar',
        stack: 'Total',
        label: {
          show: true,
          position: 'insideTop'
        },
        data: this.setInData(accounts, selectedMonths),
        color: 'green'
      }
    ]
  }

  private setOutData(accounts: Account[], selectedMonths: string[]) {
    return accounts.map(acc => {
      let out: number = 0
      acc.transactions.forEach(trans => {
        if (trans.amount < 0 && selectedMonths.some(times => trans.date.includes(times))) {
          out += trans.amount
        }
      });
      return out < 0 ? out.toFixed(0) : NaN;
    }).reverse()
  }

  private setInData(accounts: Account[], selectedMonths: string[]) {
    return accounts.map(acc => {
      let incoming: number = 0
      acc.transactions.forEach(trans => {
        if (trans.amount > 0 && selectedMonths.some(times => trans.date.includes(times))) {
          incoming += trans.amount
        }
      });
      return incoming > 0 ? incoming.toFixed(0) : NaN;
    }).reverse()
  }

  private setCategorizedData(accounts: Account[], selectedMonths: string[], categoryGroups: CategoryGroup[], categories: Category[]) {
    let catNames: string[] = []
    let catSeries: {value: number, itemStyle: { color: string }}[] = []

    accounts.map(acc => {
      acc.transactions.forEach(trans => {
        if (selectedMonths.some(times => trans.date.includes(times)) && trans.categoryId) {
          let catGroup = categoryGroups.find(catGroup => catGroup.id === (categories.find(cat => cat.id === trans.categoryId)?.group_id))
          if (catGroup) {
            let catIndex = catNames.indexOf(catGroup.name)
            if (catIndex >= 0) {
              catSeries[catIndex].value += trans.amount
            } else {
              catNames.push(catGroup.name)
              catSeries.push({value: trans.amount, itemStyle: { color: catGroup.color }})
            }
          }
        }
      });
    })
    return {
      catNames: catNames,
      catSeries: catSeries
    }
  }

  composeOptionsCategorized(accounts: Account[], selectedTimes: string[], categoryGroups: CategoryGroup[], categories: Category[]) {
    let catData: {catNames: (string|undefined)[], catSeries: {value: number, itemStyle: {color: string}}[]} = this.setCategorizedData(accounts, selectedTimes, categoryGroups, categories)
    return {
      title: { text: 'Categorized' },
      legend: {
        data: [],
        selectedMode: false
      },
      toolbox: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      yAxis: {
        type: 'category',
        data: catData.catNames
      },
      xAxis: {
        type: 'value'
      },
      series: [
        {
          data: catData.catSeries,
          type: 'bar'
        }
      ]
    };
  }

  composeOptionsTotal(accounts: Account[], selectedTimes: string[]) {
    let accNames: string[] = this.setAccountNames(accounts)
    let timeSteps: string[] = selectedTimes
    let accSeries: object[] = this.setAccountSeries(accounts, selectedTimes)
    return {
      legend: {
        data: [...accNames, 'Total'],
        selectedMode: false
      },
      toolbox: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: timeSteps,
          axisLine: { show: false },
          axisTick: { show: false }
        }
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: { lineStyle: { color: '#F0F0F0'}}
        }
      ],
      series: accSeries
    };
  }

  composeOptionsInOut(accounts: Account[], selectedTimes: string[], mobile: boolean = false) {
    let accNames: string[] = this.setAccountNames(accounts, mobile).reverse()
    let accSeries: object[] = this.setAccountInOut(accounts, selectedTimes)
    return {
      title: {
        text: 'In/Out',
      },
      legend: {
        show: false,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          axisLabel: {
            rotate: mobile ? 90 : 0
          },
          type: 'value'
        }
      ],
      yAxis: [
        {
          type: 'category',
          axisTick: {
            show: false
          },
          data: accNames
        }
      ],
      series: accSeries
    };
  }
}
