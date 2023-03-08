export interface CategoryGroup{
  id: string,
  name: string,
  color: string,
  categories?: boolean
}

export interface Category{
  id: string,
  group_id: string,
  name: string,
}

export const CategoryGroupColors = [
  { name: 'light', value: '#EAF2E3'},
  { name: 'blue', value: '#61E8E1'},
  { name: 'red', value: '#F25757'},
  { name: 'yellow', value: '#F2E863'},
  { name: 'orange', value: '#F2CD60'},
]
