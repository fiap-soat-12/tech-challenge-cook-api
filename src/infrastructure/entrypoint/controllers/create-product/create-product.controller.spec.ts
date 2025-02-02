import { ProductCategoryEnum } from '@application/enums/product-category.enum';
import { ProductStatusEnum } from '@application/enums/product-status.enum';
import { CreateProductUseCase } from '@application/usecases/products/create-product/create-product.usecase';
import { Product } from '@domain/entities/product';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductRequest } from '../../request/create-product.request';
import { GetProductResponse } from '../../response/get-product.response';
import { CreateProductController } from './create-product.controller';

describe('CreateProductController', () => {
  let controller: CreateProductController;
  let mockCreateProductUseCase: jest.Mocked<CreateProductUseCase>;

  beforeEach(async () => {
    mockCreateProductUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateProductUseCase>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateProductController],
      providers: [
        { provide: CreateProductUseCase, useValue: mockCreateProductUseCase },
      ],
    }).compile();

    controller = module.get<CreateProductController>(CreateProductController);
  });

  describe('createUser', () => {
    it('should create a product and return response', async () => {
      const request: CreateProductRequest = {
        name: 'Test Product',
        category: ProductCategoryEnum.MAIN_COURSE,
        price: 15.99,
        description: 'A delicious test product',
      };

      const mockProduct = new Product({
        id: '1',
        name: request.name,
        category: request.category,
        price: request.price,
        description: request.description,
        status: ProductStatusEnum.ACTIVE,
      });

      mockCreateProductUseCase.execute.mockResolvedValue(mockProduct);

      const result = await controller.createUser(request);

      expect(result).toBeInstanceOf(GetProductResponse);
      expect(result.id).toBe('1');
      expect(result.name).toBe(request.name);
      expect(result.category).toBe(request.category);
      expect(result.price).toBe(request.price);
      expect(result.description).toBe(request.description);
    });

    it('should handle BadRequestException (400)', async () => {
      const request: CreateProductRequest = {
        name: '',
        category: ProductCategoryEnum.MAIN_COURSE,
        price: -5,
        description: 'Invalid product',
      };

      mockCreateProductUseCase.execute.mockRejectedValue(
        new HttpException('Bad Request', HttpStatus.BAD_REQUEST),
      );

      await expect(controller.createUser(request)).rejects.toThrow(
        HttpException,
      );
      await expect(controller.createUser(request)).rejects.toThrowError(
        'Bad Request',
      );
    });

    it('should handle InternalServerErrorException (500)', async () => {
      const request: CreateProductRequest = {
        name: 'Test Product',
        category: ProductCategoryEnum.MAIN_COURSE,
        price: 15.99,
        description: 'A delicious test product',
      };

      mockCreateProductUseCase.execute.mockRejectedValue(
        new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );

      await expect(controller.createUser(request)).rejects.toThrow(
        HttpException,
      );
      await expect(controller.createUser(request)).rejects.toThrowError(
        'Internal Server Error',
      );
    });
  });
});
