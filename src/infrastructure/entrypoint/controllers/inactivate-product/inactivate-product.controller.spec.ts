import { UUID } from '@application/types/UUID.type';
import { InactivateProductUseCase } from '@application/usecases/products/inactivate-product/inactivate-product.usecase';
import { ProductNotFoundException } from '@domain/exceptions/product-not-found.exception';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InactivateProductController } from './inactivate-product.controller';

describe('InactivateProductController', () => {
  let controller: InactivateProductController;
  let mockInactivateProductUseCase: jest.Mocked<InactivateProductUseCase>;

  beforeEach(async () => {
    mockInactivateProductUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<InactivateProductUseCase>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InactivateProductController],
      providers: [
        {
          provide: InactivateProductUseCase,
          useValue: mockInactivateProductUseCase,
        },
      ],
    }).compile();

    controller = module.get<InactivateProductController>(
      InactivateProductController,
    );
  });

  describe('inactivate', () => {
    it('should inactivate a product successfully', async () => {
      const productId: UUID = 'a6b9e046-fb5a-4a79-9d86-363e6fd20e11';

      mockInactivateProductUseCase.execute.mockResolvedValue(undefined);

      await expect(controller.inactivate(productId)).resolves.toBeUndefined();

      expect(mockInactivateProductUseCase.execute).toHaveBeenCalledWith(
        productId,
      );
    });

    it('should throw a 404 error when product is not found', async () => {
      const productId: UUID = 'a6b9e046-fb5a-4a79-9d86-363e6fd20e11';

      mockInactivateProductUseCase.execute.mockRejectedValue(
        new ProductNotFoundException('Product not found'),
      );

      await expect(controller.inactivate(productId)).rejects.toThrow(
        HttpException,
      );
      await expect(controller.inactivate(productId)).rejects.toThrow(
        'Product not found',
      );
      await expect(controller.inactivate(productId)).rejects.toThrow(
        expect.objectContaining({ status: 404 }),
      );
    });

    it('should throw a 500 error for an unexpected exception', async () => {
      const productId: UUID = 'a6b9e046-fb5a-4a79-9d86-363e6fd20e11';

      mockInactivateProductUseCase.execute.mockRejectedValue(
        new Error('Unexpected database error'),
      );

      await expect(controller.inactivate(productId)).rejects.toThrow(Error);
      await expect(controller.inactivate(productId)).rejects.toThrow(
        'Unexpected database error',
      );
      await expect(controller.inactivate(productId)).rejects.toThrow(
        expect.objectContaining({ status: 500 }),
      );
    });
  });
});
