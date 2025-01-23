import { ProductCategoryType } from '@application/types/product-category.type';

export class CreateProductDto {
  constructor(
    public readonly name: string,
    public readonly category: ProductCategoryType,
    public readonly price: number,
    public readonly description: string,
  ) {}
}
