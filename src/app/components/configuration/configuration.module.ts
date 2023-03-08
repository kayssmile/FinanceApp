import { NgModule } from '@angular/core';
import { ConfigurationComponent } from './configuration.component';
import { SharedModule } from '../shared_components/shared.module';
import { CommonModule } from '@angular/common';
import { AccountFormComponent } from './account/account-form/account-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountConfigComponent } from './account/account-config/account-config.component';
import { CsvConfigComponent } from './csv/csv-config/csv-config.component';
import { CsvFormComponent } from './csv/csv-form/csv-form.component';
import { CategoryConfigComponent } from './category/category-config/category-config.component';
import { CategoryFormComponent } from './category/category-form/category-form.component';

@NgModule({
  declarations: [
    ConfigurationComponent,
    AccountFormComponent,
    AccountConfigComponent,
    CsvConfigComponent,
    CsvFormComponent,
    CategoryConfigComponent,
    CategoryFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: []
})
export class ConfigurationModule { }
