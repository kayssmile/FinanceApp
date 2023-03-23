import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, updateEmail, updatePassword } from '@angular/fire/auth';
import { StorageService } from '../../model/storage.service';
import { User } from '../types/user';
import { User as FirebaseUser } from "firebase/auth";
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail, deleteUser } from "firebase/auth";
import { DBService } from './db.service';

@Injectable({providedIn: 'root'})

export class AuthentificationService {

  constructor(private StorageService: StorageService, private auth: Auth, private router: Router, private db_Service : DBService) {}

  async login_firebase(Login: User) : Promise<boolean> {
    try {
      await signInWithEmailAndPassword(this.auth, Login.email, Login.password)
      this.StorageService.set_localStorage(this.get_currentUser())
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async new_user(User : User) : Promise<boolean> {
    try {
      await createUserWithEmailAndPassword(this.auth, User.email, User.password)
      this.db_Service.create_Userdb()
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async reset_pw(email : string) : Promise<boolean> {
    try {
      await sendPasswordResetEmail(this.auth, email)
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  get_currentUser(): FirebaseUser | boolean {
    if(this.auth.currentUser != null){
      return this.auth.currentUser
    }
    return false
  }

  logout() {
    this.StorageService.delete_localStorage()
    this.logout_firebase()
    this.router.navigate(['/login'])
  }

  logout_firebase() {
    this.auth.signOut()
  }

  isLoggedin(): boolean {
    if(this.StorageService.getUserdata()) {
      return true
    }
    if(!this.StorageService.getUserdata()) {
      return false
    }
    return false
  }

  async change_email(email : string) : Promise<boolean> {
    try {
      await updateEmail(this.auth.currentUser!, email)
      return true
    }catch(e)  {
      return false
    }
    return false
  }

  async change_password(newPassword : string) : Promise<boolean> {
    try {
      await updatePassword(this.auth.currentUser!, newPassword)
      return true
    }catch(e)  {
      return false
    }
    return false
  }

  async delete_user() : Promise<boolean> {
    await this.db_Service.delete_Userdb()
    try {
      await deleteUser(this.auth.currentUser!)
      return true
    }catch(e)  {
      return false
    }
    return false
  }




 /*
Function isLoggedin(), ist nicht sicher (Security) wurde fürs Testing so belassen.
Bei einem Öffentlichen Release wird die Funktion durch folgende ersetzt, und der
localStorage wird nicht verwendet.

  isLoggedin(): boolean {
      if(this.auth.currentUser != null) {
        return true
      }
      if(this.auth.currentUser === null) {
        return false
      }
      return false
    }
*/

}
