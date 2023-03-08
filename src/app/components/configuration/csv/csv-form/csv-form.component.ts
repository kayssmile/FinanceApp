import { Component, ElementRef, Inject, Input, OnChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { fluxDispatcherToken } from 'src/app/shared/helpers/flux.configuration';
import { csvMask } from 'src/app/shared/types/csvMask';
import { FluxAction, FluxActionTypes } from 'src/app/shared/types/actions.type';
import { UploadService } from 'src/app/shared/services/upload.service';

@Component({
  selector: 'app-csv-form',
  templateUrl: './csv-form.component.html'
})

export class CsvFormComponent implements OnChanges {
  @ViewChild('modal', { static: false }) modal!: ElementRef
  @Input() csv?: csvMask
  @Input() selector?: string

  csvForm!: FormGroup
  id!: FormControl
  name!: FormControl
  delimiter!: FormControl
  mask!: FormControl
  dateMask!: FormControl

  constructor(@Inject(fluxDispatcherToken) private dispatcher: Subject<FluxAction>, private upload : UploadService ) {
    this.csvForm = new FormGroup({
      id: this.id = new FormControl(''),
      name: this.name = new FormControl('', [Validators.required]),
      delimiter: this.delimiter = new FormControl('', [Validators.required]),
      mask: this.mask = new FormControl('', [Validators.required]),
      dateMask: this.dateMask = new FormControl('', [Validators.required]),
    })
  }

  hideModal() {
    this.modal.nativeElement.classList.remove('is-active');
    this.csvForm.reset();
  }

  submitCsvForm(e: Event) {
    e.preventDefault()
    if(this.csvForm.valid && this.csvForm.dirty) {
      this.dispatcher.next(new FluxAction(FluxActionTypes.Create,'csvMask', null, null, null, null, this.csvForm.value))
      this.hideModal()
    }
  }

  UpdateCsv(e: Event) {
    e.preventDefault()
    if (this.csvForm.valid && this.csvForm.dirty) {
      this.dispatcher.next(new FluxAction(FluxActionTypes.Update,'csvMask', null, null, null, null, this.csvForm.value))
    }
    this.hideModal()
  }

  deleteCsvMask(e: Event) {
    e.preventDefault()
    this.dispatcher.next(new FluxAction(FluxActionTypes.Delete,'csvMask', null, null, null, null, this.csv))
    this.hideModal()
  }

  ngOnChanges() {
    if (this.csv) {
      this.csvForm.markAllAsTouched()
      this.csvForm.patchValue(this.csv)
    }
  }
}
