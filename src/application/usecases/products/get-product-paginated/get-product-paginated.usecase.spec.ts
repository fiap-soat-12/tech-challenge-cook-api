import { ProductStatusEnum } from '@application/enums/product-status.enum';
import { Logger } from '@application/interfaces/logger.interface';
import { Product } from '@domain/entities/product';
import { PageCollection } from '@domain/models/page-collection';
import { ProductRepository } from '@domain/repositories/product.repository';
import { GetProductPaginatedUseCase } from './get-product-paginated.usecase';

describe('GetProductPaginatedUseCase', () => {
  let getProductPaginatedUseCase: GetProductPaginatedUseCase;
  let mockProductRepository: jest.Mocked<ProductRepository>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockProductRepository = {
      findAllByCategory: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    getProductPaginatedUseCase = new GetProductPaginatedUseCase(
      mockProductRepository,
      mockLogger,
    );
  });

  it('should return a paginated collection of products', async () => {
    const category = 'MAIN_COURSE';
    const page = 1;
    const size = 10;

    const mockProducts: Product[] = [
      new Product({
        id: '1',
        name: 'Product 1',
        category: category,
        price: 100,
        description: 'Description 1',
        status: ProductStatusEnum.ACTIVE,
      }),
    ];

    const mockPageCollection = new PageCollection<Product>({
      content: mockProducts,
      totalElements: 1,
      pageSize: size,
      currentPage: page,
    });

    mockProductRepository.findAllByCategory.mockResolvedValue(
      mockPageCollection,
    );

    const result = await getProductPaginatedUseCase.execute({
      category,
      page,
      size,
    });

    expect(mockLogger.log).toHaveBeenCalledWith(
      `Get products by Category: ${category}, Page: ${page}, Size: ${size} started`,
    );
    expect(mockProductRepository.findAllByCategory).toHaveBeenCalledWith({
      category,
      page,
      size,
      status: ProductStatusEnum.ACTIVE,
    });
    expect(result).toBe(mockPageCollection);
  });

  it('should return null if no products are found', async () => {
    const category = 'MAIN_COURSE';
    const page = 1;
    const size = 10;

    mockProductRepository.findAllByCategory.mockResolvedValue(null);

    const result = await getProductPaginatedUseCase.execute({
      category,
      page,
      size,
    });

    expect(mockLogger.log).toHaveBeenCalledWith(
      `Get products by Category: ${category}, Page: ${page}, Size: ${size} started`,
    );
    expect(mockProductRepository.findAllByCategory).toHaveBeenCalledWith({
      category,
      page,
      size,
      status: ProductStatusEnum.ACTIVE,
    });
    expect(result).toBeNull();
  });

  it('should log an error and throw if fetching products fails', async () => {
    const category = 'MAIN_COURSE';
    const page = 1;
    const size = 10;

    const error = new Error('Database error');
    mockProductRepository.findAllByCategory.mockRejectedValue(error);

    await expect(
      getProductPaginatedUseCase.execute({ category, page, size }),
    ).rejects.toThrow(`Failed to execute usecase error: ${error}`);

    expect(mockLogger.log).toHaveBeenCalledWith(
      `Get products by Category: ${category}, Page: ${page}, Size: ${size} started`,
    );
    expect(mockLogger.error).toHaveBeenCalledWith(
      `Get products by Category: ${category}, Page: ${page}, Size: ${size} failed`,
    );
    expect(mockProductRepository.findAllByCategory).toHaveBeenCalledWith({
      category,
      page,
      size,
      status: ProductStatusEnum.ACTIVE,
    });
  });
});
