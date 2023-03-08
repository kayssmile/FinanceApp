import { Inject, Injectable } from '@angular/core';
import { fluxDispatcherToken } from '../helpers/flux.configuration';
import { Subject } from 'rxjs';
import { FluxAction, FluxActionTypes } from '../types/actions.type';
import { addDoc, collection, deleteDoc, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { FluxStore } from 'src/app/model/flux-store';

@Injectable()

export class UploadService {
    constructor(@Inject(fluxDispatcherToken) private dispatcher: Subject<FluxAction>, private firestore: Firestore, public store: FluxStore) {
      this.dispatcher.subscribe(async (action: FluxAction) => {
        switch (action.type) {
          case FluxActionTypes.Create:
            if (action.selector ==='account') {
              await addDoc(collection(this.firestore, 'Database', this.store.user_db!, 'accounts'), action.account)
            }
            if(action.selector ==='categoryGroup'){
              await addDoc(collection(this.firestore, 'Database', this.store.user_db!, 'categoryGroups'), action.categoryGroup)
            }
            if(action.selector ==='category'){
              await addDoc(collection(this.firestore, 'Database', this.store.user_db!, 'categoryEntries'), action.category)
            }
            if(action.selector ==='csvMask'){
              await addDoc(collection(this.firestore, 'Database', this.store.user_db!, 'csvMasks'), action.csvMask)
            }
            break

          case FluxActionTypes.Update:
            if (action.selector ==='account') {
              await updateDoc(doc(this.firestore, 'Database', this.store.user_db!, 'accounts', action.account!.id), {
                name: action.account?.name,
                shortName: action.account?.shortName,
                description: action.account?.description,
                initialValue: action.account?.initialValue,
                currentValue: action.account?.currentValue,
                color: action.account?.color,
                csv: action.account?.csv,
                transactions: action.account?.transactions
               })
            }
            if (action.selector ==='categoryGroup') {
              await updateDoc(doc(this.firestore, 'Database', this.store.user_db!, 'categoryGroups', action.categoryGroup!.id), {
                name: action.categoryGroup?.name,
                color: action.categoryGroup?.color
              })
            }
            if (action.selector ==='csvMask') {
              await updateDoc(doc(this.firestore, 'Database', this.store.user_db!, 'csvMasks/'+ action.csvMask?.id), {
                mask: action.csvMask?.mask,
                delimiter: action.csvMask?.delimiter,
                dateMask: action.csvMask?.dateMask,
                name: action.csvMask?.name,
              })
            }
            break

          case FluxActionTypes.Delete:
            if (action.selector ==='account') {
              await deleteDoc(doc(this.firestore, 'Database', this.store.user_db!, 'accounts', action.account!.id))
            }
            if (action.selector ==='categoryGroup') {
              await deleteDoc(doc(this.firestore, 'Database', this.store.user_db!, 'categoryGroups', action.categoryGroup!.id))
            }
            if (action.selector ==='category') {
              await deleteDoc(doc(this.firestore, 'Database', this.store.user_db!, 'categoryEntries', action.category!.id))
            }
            if (action.selector ==='csvMask') {
              await deleteDoc(doc(this.firestore, 'Database', this.store.user_db!, 'csvMasks', action.csvMask!.id))
            }
            break
        }
      })
    }
}
