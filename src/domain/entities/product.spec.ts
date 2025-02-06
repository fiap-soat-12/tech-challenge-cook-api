import { ProductCategoryEnum } from '@application/enums/product-category.enum';
import { ProductStatusEnum } from '@application/enums/product-status.enum';
import { Product } from './product';

describe('Product Entity', () => {
  const validProductProps = {
    name: 'Cheese Burger',
    category: ProductCategoryEnum.MAIN_COURSE,
    price: 15.99,
    description: 'A delicious cheese burger',
    status: ProductStatusEnum.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('Creation', () => {
    it('should create a Product with valid properties', () => {
      const product = new Product(validProductProps);

      expect(product.name).toBe(validProductProps.name);
      expect(product.category.getValue()).toBe(validProductProps.category);
      expect(product.price.getValue()).toBe(validProductProps.price);
      expect(product.description).toBe(validProductProps.description);
      expect(product.status.getValue()).toBe(validProductProps.status);
      expect(product.createdAt).toBe(validProductProps.createdAt);
      expect(product.updatedAt).toBe(validProductProps.updatedAt);
    });
  });

  describe('Validation through Product entity', () => {
    it('should throw an error if price is invalid', () => {
      expect(() => new Product({ ...validProductProps, price: -10 })).toThrow(
        'Price must be greater than 0',
      );
    });

    it('should throw an error if category is invalid', () => {
      expect(
        () =>
          new Product({
            ...validProductProps,
            category: 'INVALID_CATEGORY' as any,
          }),
      ).toThrow('Invalid category: INVALID_CATEGORY');
    });

    it('should throw an error if status is invalid', () => {
      expect(
        () =>
          new Product({
            ...validProductProps,
            status: 'INVALID_STATUS' as any,
          }),
      ).toThrow('Invalid status: INVALID_STATUS');
    });
  });
});
