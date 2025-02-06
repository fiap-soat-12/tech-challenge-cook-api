import { CreateProductDto } from '@application/dto/create-product.dto';
import { ProductStatusEnum } from '@application/enums/product-status.enum';
import { Logger } from '@application/interfaces/logger.interface';
import { CreateProductInOrderUseCase } from '@application/usecases/order/send/create-product-in-order/create-product-in-order.usecase';
import { Product } from '@domain/entities/product';
import { ProductRepository } from '@domain/repositories/product.repository';
import { CreateProductUseCase } from './create-product.usecase';

describe('CreateProductUseCase', () => {
  let createProductUseCase: CreateProductUseCase;
  let mockProductRepository: jest.Mocked<ProductRepository>;
  let mockCreateProductInOrderUseCase: jest.Mocked<CreateProductInOrderUseCase>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockProductRepository = {
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findAllByCategory: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;

    mockCreateProductInOrderUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateProductInOrderUseCase>;

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    createProductUseCase = new CreateProductUseCase(
      mockProductRepository,
      mockCreateProductInOrderUseCase,
      mockLogger,
    );
  });

  it('should create a product and send it to the order system', async () => {
    const dto: CreateProductDto = {
      category: 'MAIN_COURSE',
      description: 'A test product',
      name: 'Test Product',
      price: 100,
    };

    const createdProduct = new Product({
      id: '123-uuid',
      ...dto,
      status: ProductStatusEnum.ACTIVE,
    });

    mockProductRepository.create.mockResolvedValue(createdProduct);

    const result = await createProductUseCase.execute(dto);

    expect(mockLogger.log).toHaveBeenCalledWith('Create product start:');
    expect(mockProductRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: dto.name,
        category: { value: dto.category },
        description: dto.description,
        price: { value: dto.price },
        status: { value: ProductStatusEnum.ACTIVE },
      }),
    );
    expect(mockCreateProductInOrderUseCase.execute).toHaveBeenCalledWith(
      createdProduct,
    );
    expect(result).toBe(createdProduct);
  });

  it('should log an error and throw if the creation fails', async () => {
    const dto: CreateProductDto = {
      category: 'MAIN_COURSE',
      description: 'A test product',
      name: 'Test Product',
      price: 100,
    };

    const error = new Error('Database error');
    mockProductRepository.create.mockRejectedValue(error);

    await expect(createProductUseCase.execute(dto)).rejects.toThrow(
      `Failed to execute usecase error: ${error}`,
    );

    expect(mockLogger.log).toHaveBeenCalledWith('Create product start:');
    expect(mockLogger.error).toHaveBeenCalledWith(
      'Create product failed',
      error,
    );
    expect(mockProductRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: dto.name,
        category: { value: dto.category },
        description: dto.description,
        price: { value: dto.price },
        status: { value: ProductStatusEnum.ACTIVE },
      }),
    );
    expect(mockCreateProductInOrderUseCase.execute).not.toHaveBeenCalled();
  });
});
