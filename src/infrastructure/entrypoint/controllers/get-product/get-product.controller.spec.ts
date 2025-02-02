import { ProductCategoryEnum } from '@application/enums/product-category.enum';
import { ProductStatusEnum } from '@application/enums/product-status.enum';
import { GetProductUseCase } from '@application/usecases/products/get-product/get-product.usecase';
import { Product } from '@domain/entities/product';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GetProductResponse } from '../../response/get-product.response';
import { GetProductController } from './get-product.controller';

describe('GetProductController', () => {
  let controller: GetProductController;
  let mockGetProductUseCase: jest.Mocked<GetProductUseCase>;

  beforeEach(async () => {
    mockGetProductUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetProductUseCase>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetProductController],
      providers: [
        { provide: GetProductUseCase, useValue: mockGetProductUseCase },
      ],
    }).compile();

    controller = module.get<GetProductController>(GetProductController);
  });

  describe('getProducts', () => {
    it('should return a list of products', async () => {
      const mockProducts: Product[] = [
        new Product({
          id: '1',
          name: 'Product 1',
          category: ProductCategoryEnum.MAIN_COURSE,
          price: 10,
          description: 'Description 1',
          status: ProductStatusEnum.ACTIVE,
        }),
        new Product({
          id: '2',
          name: 'Product 2',
          category: ProductCategoryEnum.DESSERT,
          price: 15,
          description: 'Description 2',
          status: ProductStatusEnum.ACTIVE,
        }),
      ];

      mockGetProductUseCase.execute.mockResolvedValue(mockProducts);

      const result = await controller.getProducts();

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(GetProductResponse);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });

    it('should return an empty array if no products are found', async () => {
      mockGetProductUseCase.execute.mockResolvedValue([]);

      const result = await controller.getProducts();

      expect(result).toEqual([]);
    });

    it('should throw a 500 error if an unexpected error occurs', async () => {
      mockGetProductUseCase.execute.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(controller.getProducts()).rejects.toThrow(HttpException);
      await expect(controller.getProducts()).rejects.toThrowError(
        'Database connection failed',
      );
      await expect(controller.getProducts()).rejects.toThrow(
        expect.objectContaining({ status: 500 }),
      );
    });
  });
});
