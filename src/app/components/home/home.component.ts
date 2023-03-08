import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthentificationService } from 'src/app/shared/services/authentification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent {
  @ViewChild('modal', { static: true }) modal!: ElementRef
  change_cred : string = 'select'
  cred_selector : string = 'empty'
  authorisation : boolean = true

  password_verification!: FormGroup
  password_change!: FormGroup
  email_change!: FormGroup
  new_email!: FormControl
  new_password!: FormControl
  password!: FormControl

  constructor( private AuthService : AuthentificationService) {
    this.password_verification = new FormGroup({
      password: this.password = new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ])
    })
    this.password_change = new FormGroup({
      new_password: this.new_password = new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ])
    })
    this.email_change = new FormGroup({
      new_email: this.new_email = new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
      ])
    })
  }

  change_Modal() {
    this.modal.nativeElement.classList.toggle('is-active')
    this.change_cred = 'select'
    this.password_verification.reset()
    this.password_change.reset()
    this.email_change.reset()
  }

  credentials( selector : string) {
    this.cred_selector = selector
    this.change_cred = 'password'
  }

  async check_password() {
    let User =  this.AuthService.get_currentUser()
    if(User !== false && User !== true) {
      let User_email = User.email
      if(await this.AuthService.login_firebase({email : User.email!, password : this.password.value})) {
        if(this.cred_selector === 'password') {
          this.change_cred = 'change_password'
        }
        if(this.cred_selector === 'email') {
          this.change_cred = 'change_email'
        }
      }else {
        this.authorisation = false
      }
    }
    this.password_verification.reset()
  }

  async set_change() {
    if (this.change_cred === 'change_password') {
      if (this.new_password.value) {
        if( await this.AuthService.change_password(this.new_password.value)) {
          this.change_cred = "success"
        }
      }
    }
    else {
      if (this.new_email.value) {
        if( await this.AuthService.change_email(this.new_email.value)) {
          this.change_cred = "successemail"
        }
      }
    }
  }

}
