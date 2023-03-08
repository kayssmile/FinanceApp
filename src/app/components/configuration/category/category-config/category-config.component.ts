import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { fluxDispatcherToken } from 'src/app/shared/helpers/flux.configuration';
import { FluxStore } from 'src/app/model/flux-store';
import { FluxAction, FluxActionTypes } from 'src/app/shared/types/actions.type';
import { Category, CategoryGroup } from 'src/app/shared/types/category';
import { CategoryFormComponent } from '../category-form/category-form.component';

@Component({
  selector: 'app-category-config',
  templateUrl: './category-config.component.html',
  styleUrls: ['./category-config.component.scss']
})
export class CategoryConfigComponent implements OnInit, OnDestroy {
  @ViewChild('categoryModal', { static: false }) categoryModal!: CategoryFormComponent

  selector: string | undefined
  categoryGroups: CategoryGroup[] = []
  categoryGroupForForm?: CategoryGroup
  categories: Category[] = []
  categoryForForm?: Category
  data: string = "isloading"
  private subscriptions : Subscription[] = []

  constructor(public store: FluxStore, @Inject(fluxDispatcherToken) private dispatcher: Subject<FluxAction>) { }

  ngOnInit() {
    this.subscriptions.push(this.store.CategoryGroups.subscribe((data) => {
      if (data.length > 0) {
        this.data = "data"
        this.categoryGroups = data
      }
      if (data.length === undefined) {
        this.data = 'isloading'
      }
      if (data.length === 0) {
        this.data = "nodata"
        this.categoryGroups = []
      }
    }))
    this.subscriptions.push(this.store.Categories.subscribe((data) => {
      if (data.length > 0) {
        this.categories = data
      }
    }))
  }

  countCategories(CategoryGroup : CategoryGroup): number {
    let categories = 0
    this.categories.forEach(category => {
      if(category.group_id === CategoryGroup.id){
        categories++
      }
    })
    return categories
  }

  createCategoryGroup() {
    this.categoryGroupForForm = undefined
    if (this.categoryGroups.length > 9) {
      this.selector = "warning"
    }
    if (this.categoryGroups.length < 10) {
      this.selector = "create"
    }
    this.categoryModal.modal.nativeElement.classList.add('is-active')
  }

  editCategoryGroup(categoryGroup: CategoryGroup) {
    this.categoryGroupForForm = categoryGroup
    this.selector = "edit"
    this.categoryModal.modal.nativeElement.classList.add('is-active')
  }

  addCategory(categoryGroup: CategoryGroup) {
    this.categoryForForm = undefined
    this.categoryGroupForForm = categoryGroup
    if (this.countCategories(categoryGroup) > 14) {
      this.selector = "warning-category"
    }
    if (this.countCategories(categoryGroup) < 15) {
      this.selector = "addCategory"
    }
    this.categoryModal.modal.nativeElement.classList.add('is-active')
  }

  deleteCategory(category: Category) {
    this.dispatcher.next(new FluxAction(FluxActionTypes.Delete, 'category', null, null, category))
  }

  ngOnDestroy() {
    this.subscriptions?.forEach((subscription) => {subscription.unsubscribe()})
  }

}
