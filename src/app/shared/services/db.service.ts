import { Injectable } from '@angular/core';
import { Auth, getAuth, updateEmail, updatePassword } from '@angular/fire/auth';
import { addDoc, collection, doc, Firestore, getDoc, getDocs } from '@angular/fire/firestore';
import { Account } from '../types/account';
import { Category, CategoryGroup } from '../types/category';


@Injectable({providedIn: 'root'})

export class DBService {
  User_DB : string = "none"

  constructor(private firestore: Firestore, private auth: Auth) {}

  async set_User_db(uid : string) : Promise<string> {
    const docSnap = await getDocs(collection(this.firestore, "Database"))
    docSnap.forEach((doc) => {
      if (doc.data()['User'] === uid) {
        this.User_DB = doc.id
      }
    })
    return this.User_DB
  }

  async create_Userdb() {
    const db_id = { User : this.auth.currentUser?.uid }
    await addDoc((collection(this.firestore, 'Database')),db_id)
  }

}
