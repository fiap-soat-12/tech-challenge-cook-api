import { UUID } from '@application/types/UUID.type';
import { InactivateProductUseCase } from '@application/usecases/products/delete-product/delete-product.usecase';
import { ProductNotFoundException } from '@domain/exceptions/product-not-found.exception';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InactivateProductController } from './inactivate-product.controller';

describe('InactivateProductController', () => {
  let controller: InactivateProductController;
  let mockDeleteProductUseCase: jest.Mocked<InactivateProductUseCase>;

  beforeEach(async () => {
    mockDeleteProductUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<InactivateProductUseCase>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InactivateProductController],
      providers: [
        {
          provide: InactivateProductUseCase,
          useValue: mockDeleteProductUseCase,
        },
      ],
    }).compile();

    controller = module.get<InactivateProductController>(
      InactivateProductController,
    );
  });

  describe('delete', () => {
    it('should delete a product successfully', async () => {
      const productId: UUID = 'a6b9e046-fb5a-4a79-9d86-363e6fd20e11';

      mockDeleteProductUseCase.execute.mockResolvedValue(undefined);

      await expect(controller.delete(productId)).resolves.toBeUndefined();

      expect(mockDeleteProductUseCase.execute).toHaveBeenCalledWith(productId);
    });

    it('should throw a 404 error when product is not found', async () => {
      const productId: UUID = 'a6b9e046-fb5a-4a79-9d86-363e6fd20e11';

      mockDeleteProductUseCase.execute.mockRejectedValue(
        new ProductNotFoundException('Product not found'),
      );

      await expect(controller.delete(productId)).rejects.toThrow(HttpException);
      await expect(controller.delete(productId)).rejects.toThrow(
        'Product not found',
      );
      await expect(controller.delete(productId)).rejects.toThrow(
        expect.objectContaining({ status: 404 }),
      );
    });

    it('should throw a 500 error for an unexpected exception', async () => {
      const productId: UUID = 'a6b9e046-fb5a-4a79-9d86-363e6fd20e11';

      mockDeleteProductUseCase.execute.mockRejectedValue(
        new Error('Unexpected database error'),
      );

      await expect(controller.delete(productId)).rejects.toThrow(Error);
      await expect(controller.delete(productId)).rejects.toThrow(
        'Unexpected database error',
      );
      await expect(controller.delete(productId)).rejects.toThrow(
        expect.objectContaining({ status: 500 }),
      );
    });
  });
});
