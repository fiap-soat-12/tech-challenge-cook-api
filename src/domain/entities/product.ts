interface ProductProps {
  id?: string;
  name: string;
  category: string;
  price: number;
  description: string;
  status: string;
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
  private static readonly allowedStatuses = ['ACTIVE', 'INACTIVE'];

  private constructor(private readonly value: string) {}

  static create(status: string): ProductStatus {
    if (!ProductStatus.allowedStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }
    return new ProductStatus(status);
  }

  getValue(): string {
    return this.value;
  }
}

class ProductCategory {
  private static readonly allowedCategories = [
    'MAIN_COURSE',
    'SIDE_DISH',
    'DRINK',
    'DESSERT',
  ];

  private constructor(private readonly value: string) {}

  static create(category: string): ProductCategory {
    if (!ProductCategory.allowedCategories.includes(category)) {
      throw new Error(`Invalid category: ${category}`);
    }
    return new ProductCategory(category);
  }

  getValue(): string {
    return this.value;
  }
}
