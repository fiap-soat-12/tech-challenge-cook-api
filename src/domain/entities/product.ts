import { ProductCategoryEnum } from '@application/enums/product-category.enum';
import { ProductStatusEnum } from '@application/enums/product-status.enum';
import { ProductCategoryType } from '@application/types/product-category.type';
import { ProductStatusType } from '@application/types/product-status.type';

interface ProductProps {
  id?: string;
  name: string;
  category: ProductCategoryType;
  price: number;
  description: string;
  status: ProductStatusType;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product {
  public readonly id: string;
  public readonly name: string;
  public readonly category: ProductCategory;
  public readonly price: ProductPrice;
  public readonly description: string;
  public readonly status: ProductStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor({ category, price, status, ...rest }: ProductProps) {
    Object.assign(this, rest);
    this.category = ProductCategory.create(category);
    this.price = ProductPrice.create(price);
    this.status = ProductStatus.create(status);
  }
}

class ProductPrice {
  private constructor(private readonly value: number) {}

  static create(price: number): ProductPrice {
    if (price <= 0) {
      throw new Error('Price must be greater than 0');
    }
    return new ProductPrice(price);
  }

  getValue(): number {
    return this.value;
  }
}

class ProductStatus {
  private static readonly allowedStatuses: ProductStatusType[] =
    Object.values(ProductStatusEnum);

  private constructor(private readonly value: ProductStatusType) {}

  static create(status: ProductStatusType): ProductStatus {
    if (!ProductStatus.allowedStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }
    return new ProductStatus(status);
  }

  getValue(): ProductStatusType {
    return this.value;
  }
}

class ProductCategory {
  private static readonly allowedCategories: ProductCategoryType[] =
    Object.values(ProductCategoryEnum);

  private constructor(private readonly value: ProductCategoryType) {}

  static create(category: ProductCategoryType): ProductCategory {
    if (!ProductCategory.allowedCategories.includes(category)) {
      throw new Error(`Invalid category: ${category}`);
    }
    return new ProductCategory(category);
  }

  getValue(): ProductCategoryType {
    return this.value;
  }
}
