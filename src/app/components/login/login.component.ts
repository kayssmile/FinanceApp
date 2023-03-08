import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/shared/services/authentification.service';
import { DBService } from 'src/app/shared/services/db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {
  @ViewChild('signinButton', { static: true }) signinButton!: ElementRef
  @ViewChild('registerButton', { static: true }) registerButton!: ElementRef
  @ViewChild('forgotButton', { static: true }) forgotButton!: ElementRef
  @ViewChild('modal', { static: true }) modal!: ElementRef

  login!: FormGroup
  email!: FormControl
  password!: FormControl
  register!: FormGroup
  email_register!: FormControl
  password_register!: FormControl
  reset_pw!: FormGroup
  reset_email!: FormControl
  authorisation : boolean = true
  login_states : string = "login"
  success : string = "none"

  constructor(private AuthService: AuthentificationService, private router: Router,
    @Inject(DOCUMENT) private document: Document, private db_Service : DBService ) {}

  ngOnInit() {
    this.document.body.removeAttribute('class')
    this.login = new FormGroup({
      email: this.email = new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
      ]),
      password: this.password = new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ])
    })
    this.register = new FormGroup({
      email_register: this.email_register = new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
      ]),
      password_register: this.password_register = new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ])
    })
    this.reset_pw = new FormGroup({
      reset_email: this.reset_email = new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
      ])
    })
  }

  async regristration() {
    if(this.register.valid) {
      this.registerButton.nativeElement.classList.add('is-loading')
      let user = {email : this.email_register.value, password : this.password_register.value}
      if (await this.AuthService.new_user(user)) {
        this.register.reset()
        this.login_states = "login"
        this.success = "credentials"
        this.modal.nativeElement.classList.add('is-active')
      }else {
        this.authorisation = false
      }
    }
    this.registerButton.nativeElement.classList.remove('is-loading')
  }

  async resetPassword() {
    if (this.reset_pw.valid){
      this.forgotButton.nativeElement.classList.add('is-loading')
      if (await this.AuthService.reset_pw(this.reset_email.value)) {
        this.reset_pw.reset()
        this.login_states = "login"
        this.success = "reset"
        this.modal.nativeElement.classList.add('is-active')
      }else {
        this.authorisation = false
        this.reset_pw.reset()
      }
    }
    this.forgotButton.nativeElement.classList.remove('is-loading')
  }

  async onSubmit() {
    if(this.login.valid) {
      this.signinButton.nativeElement.classList.add('is-loading')
      if(await this.AuthService.login_firebase(this.login.value)) {
        this.router.navigate(['/home'])
        this.login.reset()
      }else {
        this.authorisation = false
      }
      this.signinButton.nativeElement.classList.remove('is-loading')
    }
  }

  closeModal() {
    this.modal.nativeElement.classList.remove('is-active')
  }

}
