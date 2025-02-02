import { ProductCategoryEnum } from '@application/enums/product-category.enum';
import { ProductStatusEnum } from '@application/enums/product-status.enum';
import { Logger } from '@application/interfaces/logger.interface';
import { Product } from '@domain/entities/product';
import { ProductPersistenceError } from '@domain/exceptions/product-persistence-error.exception';
import { DatabaseConnection } from '@domain/interface/database-connection.interface';
import { PageCollection } from '@domain/models/page-collection';
import { ProductEntity } from './entities/product.entity';
import { ProductPersistence } from './product.persistence';

describe('ProductPersistence', () => {
  let productPersistence: ProductPersistence;
  let mockConnection: jest.Mocked<DatabaseConnection>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockConnection = {
      query: jest.fn(),
      queryPaginate: jest.fn(),
    } as unknown as jest.Mocked<DatabaseConnection>;

    mockLogger = {
      error: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    productPersistence = new ProductPersistence(mockConnection, mockLogger);
  });

  describe('findAllByCategory', () => {
    it('should return a paginated collection of products', async () => {
      const product: ProductEntity = {
        id: '1',
        name: 'Product 1',
        category: ProductCategoryEnum.DESSERT,
        price: 10,
        description: 'Description 1',
        status: ProductStatusEnum.ACTIVE,
        createdAt: undefined,
        updatedAt: undefined,
      };

      const mockResult = new PageCollection<ProductEntity>({
        content: [product],
        totalElements: 1,
        pageSize: 10,
        currentPage: 0,
      });

      mockConnection.queryPaginate.mockResolvedValue(mockResult);

      const result = await productPersistence.findAllByCategory({
        category: ProductCategoryEnum.DESSERT,
        page: 0,
        size: 10,
        status: ProductStatusEnum.ACTIVE,
      });

      expect(result).toBeInstanceOf(PageCollection);
      expect(result?.content[0]).toBeInstanceOf(Product);
      expect(result?.content[0].name).toBe('Product 1');
    });

    it('should return null if no products are found', async () => {
      const mockResult = new PageCollection<ProductEntity>({
        content: [],
        totalElements: 0,
        pageSize: 10,
        currentPage: 0,
      });

      mockConnection.queryPaginate.mockResolvedValue(mockResult);

      const result = await productPersistence.findAllByCategory({
        category: ProductCategoryEnum.MAIN_COURSE,
        page: 0,
        size: 10,
        status: ProductStatusEnum.ACTIVE,
      });

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a product and return it', async () => {
      const mockProduct: ProductEntity = {
        id: '1',
        name: 'Product 1',
        category: ProductCategoryEnum.DESSERT,
        price: 10,
        description: 'Description 1',
        status: ProductStatusEnum.ACTIVE,
        createdAt: undefined,
        updatedAt: undefined,
      };

      mockConnection.queryPaginate.mockResolvedValue(
        new PageCollection<ProductEntity>({
          content: [mockProduct],
          totalElements: 1,
          pageSize: 10,
          currentPage: 0,
        }),
      );

      mockConnection.query.mockResolvedValue([{ id: '1', ...mockProduct }]);

      const product: Product = new Product({ ...mockProduct });

      const result = await productPersistence.create(product);

      expect(result).toBeInstanceOf(Product);
      expect(result.name).toBe(mockProduct.name);
    });

    it('should log an error and throw ProductPersistenceError if creation fails', async () => {
      const mockProduct: Product = new Product({
        id: '1',
        name: 'Product 1',
        category: ProductCategoryEnum.MAIN_COURSE,
        price: 10,
        description: 'Description 1',
        status: ProductStatusEnum.ACTIVE,
      });

      mockConnection.query.mockRejectedValue(new Error('Database error'));

      await expect(productPersistence.create(mockProduct)).rejects.toThrow(
        ProductPersistenceError,
      );
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('inactivate', () => {
    it('should inactivate a product and return it', async () => {
      const mockProduct: ProductEntity = {
        id: '1',
        name: 'inactivated Product',
        category: ProductCategoryEnum.DESSERT,
        price: 10,
        description: 'Description 1',
        status: ProductStatusEnum.ACTIVE,
        createdAt: undefined,
        updatedAt: undefined,
      };

      mockConnection.query.mockResolvedValue([mockProduct]);

      const result = await productPersistence.inactivate('1');

      expect(result).toBeInstanceOf(Product);
      expect(result.name).toBe('inactivated Product');
    });

    it('should log an error and throw ProductPersistenceError if deletion fails', async () => {
      mockConnection.query.mockRejectedValue(new Error('Database error'));

      await expect(productPersistence.inactivate('1')).rejects.toThrow(
        ProductPersistenceError,
      );
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a product and return it', async () => {
      const mockProduct: ProductEntity = {
        id: '1',
        name: 'Updated Product',
        category: ProductCategoryEnum.DESSERT,
        price: 10,
        description: 'Description 1',
        status: ProductStatusEnum.ACTIVE,
        createdAt: undefined,
        updatedAt: undefined,
      };

      const product: Product = new Product(mockProduct);

      mockConnection.query.mockResolvedValue([{ ...mockProduct }]);

      const result = await productPersistence.update(product);

      expect(result).toBeInstanceOf(Product);
      expect(result.name).toBe('Updated Product');
    });

    it('should log an error and throw ProductPersistenceError if update fails', async () => {
      const mockProduct: Product = new Product({
        id: '1',
        name: 'Updated Product',
        category: ProductCategoryEnum.MAIN_COURSE,
        price: 10,
        description: 'Description 1',
        status: ProductStatusEnum.ACTIVE,
      });

      mockConnection.query.mockRejectedValue(new Error('Database error'));

      await expect(productPersistence.update(mockProduct)).rejects.toThrow(
        ProductPersistenceError,
      );
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return a list of products', async () => {
      const mockResult = [
        {
          id: '1',
          name: 'Product 1',
          category: ProductCategoryEnum.DESSERT,
          price: 10,
          description: 'Description 1',
          status: ProductStatusEnum.ACTIVE,
          createdAt: undefined,
          updatedAt: undefined,
        },
        {
          id: '2',
          name: 'Product 2',
          category: ProductCategoryEnum.DESSERT,
          price: 10,
          description: 'Description 2',
          status: ProductStatusEnum.ACTIVE,
          createdAt: undefined,
          updatedAt: undefined,
        },
      ];

      mockConnection.query.mockResolvedValue(mockResult);

      const result = await productPersistence.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Product);
    });

    it('should log an error and throw ProductPersistenceError if findAll fails', async () => {
      mockConnection.query.mockRejectedValue(new Error('Database error'));

      await expect(productPersistence.findAll()).rejects.toThrow(
        ProductPersistenceError,
      );
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a product if found', async () => {
      const mockProduct: ProductEntity = {
        id: '1',
        name: 'Product 1',
        category: ProductCategoryEnum.DESSERT,
        price: 10,
        description: 'Description 1',
        status: ProductStatusEnum.ACTIVE,
        createdAt: undefined,
        updatedAt: undefined,
      };

      const product: Product = new Product(mockProduct);

      mockConnection.query.mockResolvedValue([mockProduct]);

      const result = await productPersistence.findById('1');

      expect(result).toBeInstanceOf(Product);
      expect(result?.name).toBe('Product 1');
      expect(result).toStrictEqual(product);
    });

    it('should return null if no product is found', async () => {
      mockConnection.query.mockResolvedValue(null);

      const result = await productPersistence.findById('1');

      expect(result).toBeNull();
    });

    it('should log an error and throw ProductPersistenceError if findById fails', async () => {
      mockConnection.query.mockRejectedValue(new Error('Database error'));

      await expect(productPersistence.findById('1')).rejects.toThrow(
        ProductPersistenceError,
      );
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
});
