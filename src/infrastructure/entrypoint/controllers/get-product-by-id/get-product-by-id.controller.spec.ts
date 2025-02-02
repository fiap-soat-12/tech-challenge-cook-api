import { ProductCategoryEnum } from '@application/enums/product-category.enum';
import { ProductStatusEnum } from '@application/enums/product-status.enum';
import { UUID } from '@application/types/UUID.type';
import { GetProductByIdUseCase } from '@application/usecases/products/get-product-by-id/get-product-by-id.usecase';
import { Product } from '@domain/entities/product';
import { ProductNotFoundException } from '@domain/exceptions/product-not-found.exception';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GetProductResponse } from '../../response/get-product.response';
import { GetProductByIdController } from './get-product-by-id.controller';

describe('GetProductByIdController', () => {
  let controller: GetProductByIdController;
  let mockUseCase: jest.Mocked<GetProductByIdUseCase>;

  beforeEach(async () => {
    mockUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetProductByIdUseCase>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetProductByIdController],
      providers: [{ provide: GetProductByIdUseCase, useValue: mockUseCase }],
    }).compile();

    controller = module.get<GetProductByIdController>(GetProductByIdController);
  });

  describe('getProductById', () => {
    it('should return a product when found', async () => {
      const productId: UUID = 'a6b9e046-fb5a-4a79-9d86-363e6fd20e11';

      const mockProduct = new Product({
        id: productId,
        name: 'Product 1',
        category: ProductCategoryEnum.MAIN_COURSE,
        price: 10,
        description: 'Description 1',
        status: ProductStatusEnum.ACTIVE,
      });

      mockUseCase.execute.mockResolvedValue(mockProduct);

      const result = await controller.getProductById(productId);

      expect(result).toBeInstanceOf(GetProductResponse);
      expect(result.id).toBe(productId);
      expect(result.name).toBe('Product 1');
      expect(result.category).toBe(ProductCategoryEnum.MAIN_COURSE);
      expect(result.price).toBe(10);
    });

    it('should throw a 404 error when product is not found', async () => {
      const productId: UUID = 'a6b9e046-fb5a-4a79-9d86-363e6fd20e11';

      mockUseCase.execute.mockRejectedValue(
        new ProductNotFoundException('Product not found'),
      );

      await expect(controller.getProductById(productId)).rejects.toThrow(
        HttpException,
      );
      await expect(controller.getProductById(productId)).rejects.toThrowError(
        'Product not found',
      );
      await expect(controller.getProductById(productId)).rejects.toThrow(
        expect.objectContaining({ status: 404 }),
      );
    });

    it('should throw a 500 error for an unexpected exception', async () => {
      const productId: UUID = 'a6b9e046-fb5a-4a79-9d86-363e6fd20e11';

      mockUseCase.execute.mockRejectedValue(new Error('Database failure'));

      await expect(controller.getProductById(productId)).rejects.toThrow(
        HttpException,
      );
      await expect(controller.getProductById(productId)).rejects.toThrowError(
        'Database failure',
      );
      await expect(controller.getProductById(productId)).rejects.toThrow(
        expect.objectContaining({ status: 500 }),
      );
    });
  });
});
