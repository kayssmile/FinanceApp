import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { fluxDispatcherToken } from '../shared/helpers/flux.configuration';
import { Account } from '../shared/types/account';
import { csvMask } from '../shared/types/csvMask';
import { Category, CategoryGroup } from '../shared/types/category';
import { FluxAction, FluxActionTypes } from '../shared/types/actions.type';
import { Firestore, onSnapshot, query } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { UtilityService } from '../shared/services/utility.service';
import { DBService } from '../shared/services/db.service';
import { Auth, getAuth, onAuthStateChanged } from '@angular/fire/auth';

@Injectable()

export class FluxStore {

  Accounts: BehaviorSubject<Account[]> = new BehaviorSubject<Account[] | any>({})
  CategoryGroups: BehaviorSubject<CategoryGroup[]> = new BehaviorSubject<CategoryGroup[] | any>({info: "init"})
  Categories: BehaviorSubject<Category[]> = new BehaviorSubject<Category[] | any>({info: "init"})
  CsvMasks: BehaviorSubject<csvMask[]> = new BehaviorSubject<csvMask[] | any>({info: "init"})
  user_db: string | undefined

  constructor(@Inject(fluxDispatcherToken) private dispatcher: Subject<FluxAction>, private auth: Auth,
   private firestore: Firestore, private utilityService: UtilityService, private db_Service: DBService) {
    this.dispatcher.subscribe(async (action: FluxAction) => {
      switch (action.type) {
        case FluxActionTypes.Load:
          this.listeners_db()
       //   this.listener_accounts()
      //    this.listener_categories()
     //     this.listener_csvMasks()
        break
      }
    })
  }

  listeners_db() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user_db =  await this.db_Service.set_User_db(user.uid)
        this.listener_accounts()
        this.listener_categories()
        this.listener_csvMasks()
      }
    });
  }

  listener_accounts() {
    const q_accounts = query(collection(this.firestore, 'Database/', this.user_db!, 'accounts'))
    const listener_accounts = onSnapshot(q_accounts, (querySnapshot) => {
      let Accounts_all : Account[]  = []
      querySnapshot.forEach((doc) => {
        let data_copy : Account = Object.assign(doc.data())
        data_copy.id = doc.id
        Accounts_all.push(data_copy)
      })
      this.Accounts.next(Accounts_all)
    })
  }

  listener_categories() {
    const q_categoryGroups = query(collection(this.firestore, 'Database', this.user_db!, 'categoryGroups'))
    const listener_categoryGroups = onSnapshot(q_categoryGroups, (querySnapshot) => {
      let CategoryGroups_all : CategoryGroup[]  = []
      querySnapshot.forEach((doc) => {
        let data_copy : CategoryGroup = Object.assign(doc.data())
        data_copy.id = doc.id
        CategoryGroups_all.push(data_copy)
      })
      this.CategoryGroups.next(CategoryGroups_all)
    })
    const q_categories = query(collection(this.firestore, 'Database', this.user_db!, 'categoryEntries'))
    const listener_categories = onSnapshot(q_categories, (querySnapshot) => {
      let Categories_all : Category[] = []
      querySnapshot.forEach((doc) => {
        let data_copy: Category = Object.assign(doc.data())
        data_copy.id = doc.id
        Categories_all.push(data_copy)
      })
      this.Categories.next(Categories_all)
    })
  }

  listener_csvMasks() {
    const q_csvMasks = query(collection(this.firestore, 'Database', this.user_db!, 'csvMasks'))
    const listener_csvMasks = onSnapshot(q_csvMasks, (querySnapshot) => {
      let CsvMasks_all : csvMask[] = []
      querySnapshot.forEach((doc) => {
        let data_copy : csvMask = Object.assign(doc.data())
        data_copy.id = doc.id
        CsvMasks_all.push(data_copy)
      })
      this.CsvMasks.next(CsvMasks_all)
    })
  }

}
