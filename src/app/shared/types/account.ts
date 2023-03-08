import { Transaction } from './transaction'

export interface Account {
  name: string,
  shortName: string,
  description: string,
  initialValue: number,
  currentValue: number,
  color: string,
  csv: string,
  id: string,
  transactions: Transaction[],
}

export const AccountColors = [
  { name: 'blue', value: 'hsl(217, 71%, 53%)'},
  { name: 'light blue', value: 'hsl(204, 86%, 53%)'},
  { name: 'green', value: 'hsl(141, 71%, 48%)'},
  { name: 'yellow', value: 'hsl(48, 100%, 67%)'},
  { name: 'red', value: 'hsl(348, 100%, 61%)'},
]
