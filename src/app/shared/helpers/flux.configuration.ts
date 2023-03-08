import { InjectionToken } from '@angular/core';
import { Subject } from 'rxjs';
import { FluxAction } from '../types/actions.type';

export const fluxDispatcherToken = new InjectionToken('fluxActions')

export const fluxActionSubject = new Subject<FluxAction>()

export const FLUX_CONFIG = [
    { provide: fluxDispatcherToken, useValue: fluxActionSubject },
]
