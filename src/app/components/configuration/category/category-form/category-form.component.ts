import { Component, ElementRef, Inject, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { fluxDispatcherToken } from 'src/app/shared/helpers/flux.configuration';
import { FluxStore } from 'src/app/model/flux-store';
import { FluxAction, FluxActionTypes } from 'src/app/shared/types/actions.type';
import { Category, CategoryGroup, CategoryGroupColors } from 'src/app/shared/types/category';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html'
})

export class CategoryFormComponent implements OnInit, OnChanges {

  @ViewChild('modal', { static: false }) modal!: ElementRef
  @ViewChild('categoryIdInput') categoryIdInput!: ElementRef

  @Input() categoryGroup?: CategoryGroup
  @Input() selector?: string
  @Input() categories: Category[] = []

  categoryGroupForm!: FormGroup
  id!: FormControl
  group!: FormControl
  name!: FormControl
  color!: FormControl

  categoryForm!: FormGroup
  group_id!: FormControl
  name_category!: FormControl

  categoryColors = CategoryGroupColors
  equality_flag : boolean = false

  constructor(@Inject(fluxDispatcherToken) private dispatcher: Subject<FluxAction>, public store: FluxStore) {}

  ngOnInit() {
    this.categoryGroupForm = new FormGroup({
      id: this.id = new FormControl(''),
      name: this.name = new FormControl(''),
      group: this.group = new FormControl(''),
      color: this.color = new FormControl(''),
    })
    this.categoryForm = new FormGroup({
      group_id: this.group_id = new FormControl(''),
      name_category: this.name_category = new FormControl(''),
    })
  }

  checkCategoryGroupForm() {
    if (this.categoryGroupForm.valid && this.categoryGroupForm.dirty) {
      let categoryGroup : CategoryGroup = this.categoryGroupForm.value
      if (this.selector === 'create') {
        this.dispatcher.next(new FluxAction(FluxActionTypes.Create,'categoryGroup', null, categoryGroup))
      }
      if (this.selector === 'edit') {
        this.dispatcher.next(new FluxAction(FluxActionTypes.Update,'categoryGroup', null, categoryGroup))
      }
    }
  }

  submitCategoryGroupForm(e: Event) {
    e.preventDefault()
    this.checkCategoryGroupForm()
    this.hideModal();
  }

  submitCategoryForm(e: Event) {
    e.preventDefault();
    if (this.categoryForm.valid && this.categoryForm.dirty) {
      let category : Category = {name : this.categoryForm.value.name_category, group_id : this.categoryGroup!.id, id: ""}
      this.dispatcher.next(new FluxAction(FluxActionTypes.Create, 'category', null, null, category))
      this.hideModal();
    }
  }

  deleteCategoryGroup() {
    this.categories.filter(c => c.group_id === this.categoryGroup?.id).forEach(catDelete => {
      this.dispatcher.next(new FluxAction(FluxActionTypes.Delete,'category', null, null, catDelete))
    })
    this.dispatcher.next(new FluxAction(FluxActionTypes.Delete,'categoryGroup', null, this.categoryGroup))
    this.hideModal();
  }

  hideModal() {
    this.modal.nativeElement.classList.remove('is-active')
    this.categoryGroupForm.reset();
    this.categoryForm.reset();
  }

  ngOnChanges() {
    if (this.categoryGroup) {
      this.categoryGroupForm.markAllAsTouched()
      this.categoryGroupForm.patchValue(this.categoryGroup)
    }
  }

}
