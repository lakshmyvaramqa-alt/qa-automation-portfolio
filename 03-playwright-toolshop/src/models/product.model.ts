export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: {
    id: string;
    name: string;
  };
  brand?: {
    id: string;
    name: string;
  };
  is_rental?: boolean;
}

export type SortOption =
  | 'name,asc'
  | 'name,desc'
  | 'price,asc'
  | 'price,desc';
