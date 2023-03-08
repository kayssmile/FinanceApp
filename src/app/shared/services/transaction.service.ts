import { Injectable } from '@angular/core';
import { Account } from '../types/account';
import { csvMask } from '../types/csvMask';
import { DATE_FORMAT, Transaction } from '../types/transaction';
import * as moment from 'moment';

@Injectable({providedIn: 'root'})

export class TransactionService {
  constructor() { }

  cookTransactions(transactions: [], csvMask: csvMask) {
    let readyTransactions: Transaction[] = [];
    let setPositions = this.resolveCsvMask(csvMask);
    if (setPositions) {
      transactions.forEach((t: String) => {
        let tArray = t.split(csvMask.delimiter);

        // lets set 3 as min since there is info, amount and date
        if (tArray.length >= 3) {
          let transactionDate: any = setPositions?.datePos != undefined ?
            moment(tArray[setPositions.datePos], csvMask.dateMask.toUpperCase())
            :
            moment(new Date())
          if (transactionDate._isValid) {
            // mask can have multiple 'amount' fields for pos/neg values, usually only one contains data
            setPositions?.amountPos.forEach(ap => {
              if (
                ap &&
                tArray[ap] != '' &&
                !isNaN(parseFloat(tArray[ap]))
              ) {
                readyTransactions.push({
                  description: setPositions?.descriptionPos ? tArray[setPositions.descriptionPos].replace(/\"/gi, '').trim() : 'error',
                  fromAccount: '',
                  amount: parseFloat(tArray[ap]),
                  date: transactionDate.format(DATE_FORMAT),
                  categoryId: '',
                  id: ''
                })
              }
            })
          }
        }
      });
    }
    // reverse here to have the oldest first
    return readyTransactions.reverse();
  }

  resolveCsvMask(csvMask: csvMask) {
    let setArray = csvMask.mask.split(csvMask.delimiter);
    let descriptionPos = setArray.findIndex(el => el == 'info');
    let datePos = setArray.findIndex(el => el == 'date');
    let amountPos = setArray.map((e, i) => e == 'amount' ? i : '').filter(String);
    if (
      descriptionPos >= 0 && descriptionPos !== undefined &&
      datePos >= 0 && datePos !== undefined &&
      amountPos.length
    ) {
      return {
        datePos,
        descriptionPos,
        amountPos
      }
    } else {
      return null;
    }
  }

  extractMonths(accounts: Account[]) {
    let allTransactions: Transaction[] = []
    let groupedMonths: any[] = []
    let uniqueMonths: string[] = []
    let uniqueYears: string[] = []
    accounts.forEach(acc => {
      if (acc.transactions) {
        allTransactions.push(...acc.transactions)
      }
    });
    uniqueMonths = Array.from(new Set(allTransactions.map(t => moment(t.date, DATE_FORMAT).format('MM.YYYY')))).sort()
    uniqueYears = Array.from(new Set(allTransactions.map(t => moment(t.date, DATE_FORMAT).format('Y')))).sort()
    uniqueYears.forEach(y => groupedMonths.push(uniqueMonths.filter(m => m.includes(y))))
    return groupedMonths
  }
}
