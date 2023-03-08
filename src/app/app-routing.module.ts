import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LoginComponent } from './components/login/login.component'
import { HomeComponent } from './components/home/home.component'
import { DashboardComponent } from './components/dashboard/dashboard.component'
import { ConfigurationComponent } from './components/configuration/configuration.component'
import { ManualComponent } from './components/manual/manual.component'
import { AuthGuard } from './shared/helpers/auth.guard'

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
    data: {role: 'login'},
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: {role: 'home'},
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule),
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {role: 'dashboard'},
  },
  {
    path: 'configuration',
    loadChildren: () => import('./components/configuration/configuration.module').then(m => m.ConfigurationModule),
    component: ConfigurationComponent,
    canActivate: [AuthGuard],
    data: {role: 'configuration'},
  },
  {
    path: 'manual',
    component: ManualComponent,
    canActivate:  [AuthGuard],
    data: {role: 'manual'}
  },
  {path: '', redirectTo: 'login', pathMatch: 'full'},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
