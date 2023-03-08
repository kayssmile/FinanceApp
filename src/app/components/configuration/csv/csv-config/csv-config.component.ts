import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { FluxStore } from 'src/app/model/flux-store';
import { csvMask } from 'src/app/shared/types/csvMask';
import { CsvFormComponent } from '../csv-form/csv-form.component';

@Component({
  selector: 'app-csv-config',
  templateUrl: './csv-config.component.html',
  styleUrls: ['./csv-config.component.scss']
})

export class CsvConfigComponent implements OnInit, OnDestroy {
  @ViewChild('csvModal') csvModal!: CsvFormComponent

  csvMasks: csvMask[] = []
  csvForForm?: csvMask
  selector: string | undefined
  data: string | undefined
  private subscription : Subscription | undefined

  constructor(public store: FluxStore) { }

  ngOnInit() {
    this.subscription = this.store.CsvMasks.subscribe(data => {
      if (data.length) {
        this.data = 'data'
        this.csvMasks = data
      }
      if (data.length === undefined) {
        this.data = 'isloading'
      }
      if (data.length === 0) {
        this.data = 'nodata'
        this.csvMasks = []
      }
    })
  }

  createCsv() {
    this.csvForForm = undefined
    if (this.csvMasks.length > 9) {
      this.selector = "warning"
    }
    if (this.csvMasks.length < 10) {
      this.selector = "create"
    }
    this.csvModal.modal.nativeElement.classList.add('is-active')
  }

  editCsv(csv: csvMask) {
    this.csvForForm = csv
    this.selector = 'edit'
    this.csvModal.modal.nativeElement.classList.add('is-active')
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe()
  }
}
