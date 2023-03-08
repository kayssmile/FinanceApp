import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { AuthentificationService } from 'src/app/shared/services/authentification.service';
import { StorageService } from 'src/app/model/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})

export class NavigationComponent implements AfterViewInit {
  @ViewChild('navMenu') navMenu!: ElementRef
  @ViewChild('select_theme') select_theme!: ElementRef
  @ViewChild('dropdown') dropdown!: ElementRef
  @ViewChild('theme_select') theme!: ElementRef
  @ViewChild('hamburgerBtn') hamburgerBtn!: ElementRef

  classlist : DOMTokenList | undefined
  router: Router

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private AuthService: AuthentificationService,
    private StorageService: StorageService,
    router: Router
  ) {
    this.router = router
  }

  ngAfterViewInit() {
    this.document.body.classList.add('has-navbar-fixed-top')
    let theme = localStorage.getItem('theme-preference')
    if(!theme){
      theme = 'dark-theme'
    }
    this.set_theme(theme)
  }

  expandBurgerMenu(e : Event) {
    e.stopPropagation()
    this.hamburgerBtn.nativeElement.classList.toggle('is-active')
    this.navMenu.nativeElement.classList.toggle('is-active')
  }

  set_theme(theme : string) {
    this.StorageService.set_theme_preference(theme)
    this.document.body.classList.remove('light-theme', 'dark-theme', 'color-theme')
    if (theme === "light-theme") {
      this.theme.nativeElement.innerText = "Light Theme"
      this.document.body.classList.add('light-theme')
    }
    if (theme === "dark-theme") {
      this.theme.nativeElement.innerText = "Dark Theme"
      this.document.body.classList.add('dark-theme')
    }
    if (theme === "color-theme") {
      this.theme.nativeElement.innerText = "Color Theme"
      this.document.body.classList.add('color-theme')
    }
  }

  change_color() {
    this.theme.nativeElement.classList.toggle('background')
  }

  logout() {
    this.AuthService.logout()
  }
}
