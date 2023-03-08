export const DATE_FORMAT = 'DD.MM.YYYY'

export interface Transaction {
  description: string,
  fromAccount?: string,
  amount: number,
  date: string,
  categoryId: string,
  categoryName?: string,
  accountName?: String,
  accountShortName?: String,
  id: string
}
