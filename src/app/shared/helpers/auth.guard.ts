import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(private AuthService: AuthentificationService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
    if (route.data['role'] === 'login') {
      if (this.AuthService.isLoggedin()) {
        this.router.navigate(['/home'])
        return false
      }
      else {
        return true
      }
    }
    if (route.data['role'] !== 'login') {
      if (this.AuthService.isLoggedin()) {
        return true
      }
      else {
        this.router.navigate(['/login'])
        return false
      }
    }
    return false
  }
}
