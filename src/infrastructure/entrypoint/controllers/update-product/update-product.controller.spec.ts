import { ProductCategoryEnum } from '@application/enums/product-category.enum';
import { ProductStatusEnum } from '@application/enums/product-status.enum';
import { UUID } from '@application/types/UUID.type';
import { UpdateProductUseCase } from '@application/usecases/products/update-product/update-product.usecase';
import { Product } from '@domain/entities/product';
import { ProductNotFoundException } from '@domain/exceptions/product-not-found.exception';
import { UpdateProductRequest } from '@infrastructure/entrypoint/request/update-product.request';
import { GetProductResponse } from '@infrastructure/entrypoint/response/get-product.response';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProductController } from './update-product.controller';

describe('UpdateProductController', () => {
  let controller: UpdateProductController;
  let mockUseCase: jest.Mocked<UpdateProductUseCase>;

  beforeEach(async () => {
    mockUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UpdateProductUseCase>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateProductController],
      providers: [{ provide: UpdateProductUseCase, useValue: mockUseCase }],
    }).compile();

    controller = module.get<UpdateProductController>(UpdateProductController);
  });

  describe('update', () => {
    it('should update a product and return response', async () => {
      const productId: UUID = 'a6b9e046-fb5a-4a79-9d86-363e6fd20e11';
      const updateRequest: UpdateProductRequest = {
        name: 'Updated Product',
        category: ProductCategoryEnum.MAIN_COURSE,
        price: 20,
        description: 'Updated description',
      };

      const mockProduct = new Product({
        id: productId,
        name: updateRequest.name,
        category: updateRequest.category,
        price: updateRequest.price,
        description: updateRequest.description,
        status: ProductStatusEnum.ACTIVE,
      });

      mockUseCase.execute.mockResolvedValue(mockProduct);

      const result = await controller.update(productId, updateRequest);

      expect(result).toBeInstanceOf(GetProductResponse);
      expect(result.id).toBe(productId);
      expect(result.name).toBe(updateRequest.name);
      expect(result.category).toBe(updateRequest.category);
      expect(result.price).toBe(updateRequest.price);
    });

    it('should throw a 404 error when product is not found', async () => {
      const productId: UUID = 'a6b9e046-fb5a-4a79-9d86-363e6fd20e11';
      const updateRequest: UpdateProductRequest = {
        name: 'Updated Product',
        category: ProductCategoryEnum.MAIN_COURSE,
        price: 20,
        description: 'Updated description',
      };

      mockUseCase.execute.mockRejectedValue(
        new ProductNotFoundException('Product not found'),
      );

      await expect(controller.update(productId, updateRequest)).rejects.toThrow(
        HttpException,
      );
      await expect(controller.update(productId, updateRequest)).rejects.toThrow(
        'Product not found',
      );
      await expect(controller.update(productId, updateRequest)).rejects.toThrow(
        expect.objectContaining({ status: 404 }),
      );
    });

    it('should throw a 500 error for an unexpected exception', async () => {
      const productId: UUID = 'a6b9e046-fb5a-4a79-9d86-363e6fd20e11';
      const updateRequest: UpdateProductRequest = {
        name: 'Updated Product',
        category: ProductCategoryEnum.MAIN_COURSE,
        price: 20,
        description: 'Updated description',
      };

      mockUseCase.execute.mockRejectedValue(
        new Error('Unexpected database error'),
      );

      await expect(controller.update(productId, updateRequest)).rejects.toThrow(
        HttpException,
      );
      await expect(controller.update(productId, updateRequest)).rejects.toThrow(
        'Unexpected database error',
      );
      await expect(controller.update(productId, updateRequest)).rejects.toThrow(
        expect.objectContaining({ status: 500 }),
      );
    });
  });
});
