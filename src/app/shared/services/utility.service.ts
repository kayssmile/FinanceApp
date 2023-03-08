import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { Account } from '../types/account';
import { Category, CategoryGroup } from '../types/category';

@Injectable({providedIn: 'root'})

export class UtilityService {

  constructor(private auth: Auth) {}

  checkavailableCategories(categoryGroups : CategoryGroup[], categories : Category[]) : CategoryGroup[]{
    if(categoryGroups && categories){
      categoryGroups.forEach(categoryGroup => {
        categoryGroup.categories = false
        categories.forEach(category =>{
          if(categoryGroup.id === category.group_id){
            categoryGroup.categories = true
          }
        })
      })
    }
    return categoryGroups
  }

  calculateCurrentValue(account: Account) {
    let currentValue = account.initialValue
    account.transactions.forEach(t => {
      currentValue += t.amount
    });
    return Number(currentValue).toFixed(2)
  }
}
