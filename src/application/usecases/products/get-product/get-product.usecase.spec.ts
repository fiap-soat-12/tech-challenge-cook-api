import { Logger } from '@application/interfaces/logger.interface';
import { Product } from '@domain/entities/product';
import { ProductRepository } from '@domain/repositories/product.repository';
import { GetProductUseCase } from './get-product.usecase';

describe('GetProductUseCase', () => {
  let getProductUseCase: GetProductUseCase;
  let mockProductRepository: jest.Mocked<ProductRepository>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockProductRepository = {
      findAll: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findAllByCategory: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    getProductUseCase = new GetProductUseCase(
      mockProductRepository,
      mockLogger,
    );
  });

  it('should return a list of products when products exist', async () => {
    const mockProducts: Product[] = [
      new Product({
        id: '1',
        name: 'Product 1',
        category: 'MAIN_COURSE',
        price: 100,
        description: 'Description 1',
        status: 'ACTIVE',
      }),
      new Product({
        id: '2',
        name: 'Product 2',
        category: 'DESSERT',
        price: 50,
        description: 'Description 2',
        status: 'ACTIVE',
      }),
    ];

    mockProductRepository.findAll.mockResolvedValue(mockProducts);

    const result = await getProductUseCase.execute();

    expect(mockLogger.error).toHaveBeenCalledWith('Get all product started');
    expect(mockProductRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockProducts);
  });

  it('should return null if no products are found', async () => {
    mockProductRepository.findAll.mockResolvedValue([]);

    const result = await getProductUseCase.execute();

    expect(mockLogger.error).toHaveBeenCalledWith('Get all product started');
    expect(mockProductRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });

  it('should log an error and throw if fetching products fails', async () => {
    const error = new Error('Database error');
    mockProductRepository.findAll.mockRejectedValue(error);

    await expect(getProductUseCase.execute()).rejects.toThrow(
      `Failed to execute usecase error: ${error}`,
    );

    expect(mockLogger.error).toHaveBeenCalledWith('Get all product started');
    expect(mockLogger.error).toHaveBeenCalledWith('Get all product failed');
    expect(mockProductRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
