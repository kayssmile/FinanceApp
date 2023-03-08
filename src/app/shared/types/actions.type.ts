import { Transaction } from './transaction'
import { Category, CategoryGroup } from './category'
import { Account } from './account'
import { csvMask } from './csvMask'

export enum FluxActionTypes {
    Load,
    Create,
    Update,
    Delete
}

export class FluxAction {
    constructor(
        public type: FluxActionTypes,
        public selector?: string | null,
        public transaction?: Transaction | null,
        public categoryGroup?: CategoryGroup | null,
        public category?: Category | null,
        public account?: Account | null,
        public csvMask?: csvMask
    ) {}
}
