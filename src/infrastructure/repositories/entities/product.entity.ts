import { ProductCategoryType } from '@application/types/product-category.type';
import { ProductStatusType } from '@application/types/product-status.type';

export interface ProductEntity {
  id?: string;
  name: string;
  category: ProductCategoryType;
  price: number;
  description: string;
  status: ProductStatusType;
  createdAt: Date;
  updatedAt: Date;
}
