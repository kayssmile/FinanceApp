import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UploadService } from 'src/app/shared/services/upload.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {
  title = 'FinanceApp';

  constructor(public router: Router, private UploadService: UploadService) {}
}
