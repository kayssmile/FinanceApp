import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { fluxDispatcherToken } from 'src/app/shared/helpers/flux.configuration';
import { FluxAction, FluxActionTypes } from 'src/app/shared/types/actions.type';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html'
})

export class ConfigurationComponent implements OnInit {
  constructor(@Inject(fluxDispatcherToken) private dispatcher: Subject<FluxAction>) {}

  ngOnInit() {
    this.dispatcher.next(new FluxAction(FluxActionTypes.Load))
  }
}
