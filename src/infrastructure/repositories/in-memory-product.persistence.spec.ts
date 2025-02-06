import { ProductCategoryEnum } from '@application/enums/product-category.enum';
import { ProductStatusEnum } from '@application/enums/product-status.enum';
import { Product } from '@domain/entities/product';
import { PageCollection } from '@domain/models/page-collection';
import { InMemoryProductRepository } from './in-memory-product.persistence';

describe('InMemoryProductRepository', () => {
  let repository: InMemoryProductRepository;

  beforeEach(() => {
    repository = new InMemoryProductRepository();
  });

  describe('findById', () => {
    it('should return a product if found', async () => {
      const product = new Product({
        id: '1',
        name: 'Product 1',
        category: ProductCategoryEnum.MAIN_COURSE,
        price: 10,
        description: 'Description 1',
        status: ProductStatusEnum.ACTIVE,
      });

      await repository.create(product);

      const result = await repository.findById('1');

      expect(result).toBeInstanceOf(Product);
      expect(result?.id).toBe('1');
    });

    it('should return null if no product is found', async () => {
      const result = await repository.findById('1');
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const product1 = new Product({
        id: '1',
        name: 'Product 1',
        category: ProductCategoryEnum.MAIN_COURSE,
        price: 10,
        description: 'Description 1',
        status: ProductStatusEnum.ACTIVE,
      });

      const product2 = new Product({
        id: '2',
        name: 'Product 2',
        category: ProductCategoryEnum.DESSERT,
        price: 15,
        description: 'Description 2',
        status: ProductStatusEnum.ACTIVE,
      });

      await repository.create(product1);
      await repository.create(product2);

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Product);
    });

    it('should return an empty array if no products are found', async () => {
      const result = await repository.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('should add a product to the repository', async () => {
      const product = new Product({
        id: '1',
        name: 'Product 1',
        category: ProductCategoryEnum.MAIN_COURSE,
        price: 10,
        description: 'Description 1',
        status: ProductStatusEnum.ACTIVE,
      });

      const result = await repository.create(product);

      expect(result).toBeInstanceOf(Product);
      expect(result.name).toBe('Product 1');

      const allProducts = await repository.findAll();
      expect(allProducts).toHaveLength(1);
    });
  });

  describe('inactivate', () => {
    it('should remove a product from the repository', async () => {
      const product = new Product({
        id: '1',
        name: 'Product 1',
        category: ProductCategoryEnum.MAIN_COURSE,
        price: 10,
        description: 'Description 1',
        status: ProductStatusEnum.ACTIVE,
      });

      await repository.create(product);
      await repository.inactivate('1');

      const result = await repository.findAll();
      expect(result).toHaveLength(0);
    });

    it('should throw an error if the product is not found', async () => {
      await expect(repository.inactivate('1')).rejects.toThrow(
        'Product with id 1 not found',
      );
    });
  });

  describe('update', () => {
    it('should update an existing product', async () => {
      const product = new Product({
        id: '1',
        name: 'Product 1',
        category: ProductCategoryEnum.MAIN_COURSE,
        price: 10,
        description: 'Description 1',
        status: ProductStatusEnum.ACTIVE,
      });

      await repository.create(product);

      const updatedProduct = new Product({
        id: '1',
        name: 'Updated Product',
        category: ProductCategoryEnum.MAIN_COURSE,
        price: 15,
        description: 'Updated Description',
        status: ProductStatusEnum.INACTIVE,
      });

      const result = await repository.update(updatedProduct);

      expect(result.name).toBe('Updated Product');
      expect(result.price).toEqual({ value: 15 });

      const allProducts = await repository.findAll();
      expect(allProducts[0].name).toBe('Updated Product');
    });

    it('should throw an error if the product is not found', async () => {
      const updatedProduct = new Product({
        id: '1',
        name: 'Updated Product',
        category: ProductCategoryEnum.MAIN_COURSE,
        price: 15,
        description: 'Updated Description',
        status: ProductStatusEnum.INACTIVE,
      });

      await expect(repository.update(updatedProduct)).rejects.toThrow(
        'Product with id 1 not found',
      );
    });
  });

  describe('findAllByCategory', () => {
    it('should return a paginated collection of products by category', async () => {
      const product1 = new Product({
        id: '1',
        name: 'Product 1',
        category: ProductCategoryEnum.MAIN_COURSE,
        price: 10,
        description: 'Description 1',
        status: ProductStatusEnum.ACTIVE,
      });

      const product2 = new Product({
        id: '2',
        name: 'Product 2',
        category: ProductCategoryEnum.MAIN_COURSE,
        price: 15,
        description: 'Description 2',
        status: ProductStatusEnum.ACTIVE,
      });

      const product3 = new Product({
        id: '3',
        name: 'Product 3',
        category: ProductCategoryEnum.DESSERT,
        price: 20,
        description: 'Description 3',
        status: ProductStatusEnum.ACTIVE,
      });

      await repository.create(product1);
      await repository.create(product2);
      await repository.create(product3);

      const result = await repository.findAllByCategory({
        category: ProductCategoryEnum.MAIN_COURSE,
        status: ProductStatusEnum.ACTIVE,
        page: 1,
        size: 1,
      });

      expect(result).toBeInstanceOf(PageCollection);
      expect(result?.content).toHaveLength(1);
      expect(result?.totalElements).toBe(2);
    });

    it('should return null if no products match the category', async () => {
      const result = await repository.findAllByCategory({
        category: ProductCategoryEnum.DESSERT,
        status: ProductStatusEnum.INACTIVE,
        page: 1,
        size: 1,
      });

      expect(result).toBeNull();
    });
  });
});
