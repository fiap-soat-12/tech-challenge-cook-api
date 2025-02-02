import { Logger } from '@application/interfaces/logger.interface';
import { Product } from '@domain/entities/product';
import { ProductRepository } from '@domain/repositories/product.repository';
import { GetProductByIdUseCase } from './get-product-by-id.usecase';

describe('GetProductByIdUseCase', () => {
  let getProductByIdUseCase: GetProductByIdUseCase;
  let mockProductRepository: jest.Mocked<ProductRepository>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockProductRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      findAllByCategory: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    getProductByIdUseCase = new GetProductByIdUseCase(
      mockProductRepository,
      mockLogger,
    );
  });

  it('should return the product when it exists', async () => {
    const mockProduct = new Product({
      id: '1',
      name: 'Test Product',
      category: 'MAIN_COURSE',
      price: 100,
      description: 'Test Description',
      status: 'ACTIVE',
    });

    mockProductRepository.findById.mockResolvedValue(mockProduct);

    const result = await getProductByIdUseCase.execute('1');

    expect(mockLogger.log).toHaveBeenCalledWith('Get product by id: 1 started');
    expect(mockProductRepository.findById).toHaveBeenCalledWith('1');
    expect(result).toBe(mockProduct);
  });

  it('should throw ProductNotFoundException when product does not exist', async () => {
    mockProductRepository.findById.mockResolvedValue(null);

    await expect(getProductByIdUseCase.execute('1')).rejects.toThrow(Error);

    expect(mockLogger.log).toHaveBeenCalledWith('Get product by id: 1 started');
    expect(mockProductRepository.findById).toHaveBeenCalledWith('1');
    expect(mockLogger.error).toHaveBeenCalledWith(
      'Get product with id: 1 failed',
    );
  });

  it('should log an error and throw if fetching the product fails', async () => {
    const error = new Error('Database error');
    mockProductRepository.findById.mockRejectedValue(error);

    await expect(getProductByIdUseCase.execute('1')).rejects.toThrow(
      `Failed to execute usecase error: ${error}`,
    );

    expect(mockLogger.log).toHaveBeenCalledWith('Get product by id: 1 started');
    expect(mockLogger.error).toHaveBeenCalledWith(
      'Get product with id: 1 failed',
    );
    expect(mockProductRepository.findById).toHaveBeenCalledWith('1');
  });
});
