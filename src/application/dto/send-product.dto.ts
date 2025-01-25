import { ProductCategoryType } from '@application/types/product-category.type';
import { ProductStatusType } from '@application/types/product-status.type';

export class SendProductDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly category: ProductCategoryType,
    public readonly price: number,
    public readonly description: string,
    public readonly status: ProductStatusType,
  ) {}
}
