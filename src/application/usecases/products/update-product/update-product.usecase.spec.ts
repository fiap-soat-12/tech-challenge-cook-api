import { UpdateProductDto } from '@application/dto/update-product.dto';
import { Logger } from '@application/interfaces/logger.interface';
import { UpdateProductInOrderUseCase } from '@application/usecases/order/send/update-product-in-order/update-product-in-order.usecase';
import { Product } from '@domain/entities/product';
import { ProductRepository } from '@domain/repositories/product.repository';
import { UpdateProductUseCase } from './update-product.usecase';

describe('UpdateProductUseCase', () => {
  let updateProductUseCase: UpdateProductUseCase;
  let mockProductRepository: jest.Mocked<ProductRepository>;
  let mockUpdateProductInOrderUseCase: jest.Mocked<UpdateProductInOrderUseCase>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockProductRepository = {
      findById: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findAllByCategory: jest.fn(),
      inactivate: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;

    mockUpdateProductInOrderUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UpdateProductInOrderUseCase>;

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    updateProductUseCase = new UpdateProductUseCase(
      mockProductRepository,
      mockUpdateProductInOrderUseCase,
      mockLogger,
    );
  });

  it('should update a product and execute the update in order', async () => {
    const id = '1';
    const existingProduct = new Product({
      id,
      name: 'Existing Product',
      category: 'MAIN_COURSE',
      price: 100,
      description: 'Existing Description',
      status: 'ACTIVE',
    });

    const updateDto: UpdateProductDto = {
      name: 'Updated Product',
      category: 'DESSERT',
      price: 150,
      description: 'Updated Description',
    };

    mockProductRepository.findById.mockResolvedValue(existingProduct);

    const updatedProduct = new Product({
      id,
      name: updateDto.name,
      category: updateDto.category,
      price: updateDto.price,
      description: updateDto.description,
      status: existingProduct.status.getValue(),
    });

    mockProductRepository.update.mockResolvedValue(existingProduct);

    await updateProductUseCase.execute(id, updateDto);

    expect(mockLogger.log).toHaveBeenCalledWith(
      `Update product by id: ${id} started`,
    );
    expect(mockProductRepository.findById).toHaveBeenCalledWith(id);
    expect(mockProductRepository.update).toHaveBeenCalledWith(updatedProduct);
    expect(mockUpdateProductInOrderUseCase.execute).toHaveBeenCalledWith(
      updatedProduct,
    );
  });

  it('should throw ProductNotFoundException if the product does not exist', async () => {
    const id = '1';
    const updateDto: UpdateProductDto = {
      name: 'Updated Product',
      category: 'DESSERT',
      price: 150,
      description: 'Updated Description',
    };

    mockProductRepository.findById.mockResolvedValue(null);

    await expect(updateProductUseCase.execute(id, updateDto)).rejects.toThrow(
      Error,
    );

    expect(mockLogger.log).toHaveBeenCalledWith(
      `Update product by id: ${id} started`,
    );
    expect(mockProductRepository.findById).toHaveBeenCalledWith(id);
    expect(mockLogger.error).toHaveBeenCalledWith(
      `Update product with id: 1 failed`,
    );
  });

  it('should log an error and throw if updating the product fails', async () => {
    const id = '1';
    const existingProduct = new Product({
      id,
      name: 'Existing Product',
      category: 'MAIN_COURSE',
      price: 100,
      description: 'Existing Description',
      status: 'ACTIVE',
    });

    const updateDto: UpdateProductDto = {
      name: 'Updated Product',
      category: 'DESSERT',
      price: 150,
      description: 'Updated Description',
    };

    const error = new Error('Database error');

    mockProductRepository.findById.mockResolvedValue(existingProduct);
    mockProductRepository.update.mockRejectedValue(error);

    await expect(updateProductUseCase.execute(id, updateDto)).rejects.toThrow(
      `Failed to execute usecase error: ${error}`,
    );

    expect(mockLogger.log).toHaveBeenCalledWith(
      `Update product by id: ${id} started`,
    );
    expect(mockLogger.error).toHaveBeenCalledWith(
      `Update product with id: ${id} failed`,
    );
    expect(mockProductRepository.update).toHaveBeenCalledWith(
      expect.any(Product),
    );
  });
});
