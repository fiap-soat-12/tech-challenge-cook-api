import { ProductCategoryEnum } from '@application/enums/product-category.enum';
import { ProductStatusEnum } from '@application/enums/product-status.enum';
import { GetProductPaginatedUseCase } from '@application/usecases/products/get-product-paginated/get-product-paginated.usecase';
import { Product } from '@domain/entities/product';
import { PageCollection } from '@domain/models/page-collection';
import { GetProductsQueryRequest } from '@infrastructure/entrypoint/request/get-products-query.request';
import { PaginatedResponseDto } from '@infrastructure/entrypoint/request/paginated.request';
import { GetProductResponse } from '@infrastructure/entrypoint/response/get-product.response';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { GetProductPaginatedController } from './get-product-paginated.controller';

describe('GetProductPaginatedController', () => {
  let controller: GetProductPaginatedController;
  let mockUseCase: jest.Mocked<GetProductPaginatedUseCase>;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    mockUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetProductPaginatedUseCase>;

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as Partial<Response>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetProductPaginatedController],
      providers: [
        { provide: GetProductPaginatedUseCase, useValue: mockUseCase },
      ],
    }).compile();

    controller = module.get<GetProductPaginatedController>(
      GetProductPaginatedController,
    );
  });

  describe('getProductsPaginated', () => {
    it('should return a paginated response of products', async () => {
      const query: GetProductsQueryRequest = {
        page: 1,
        size: 2,
        category: ProductCategoryEnum.MAIN_COURSE,
      };

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
          category: ProductCategoryEnum.MAIN_COURSE,
          price: 15,
          description: 'Description 2',
          status: ProductStatusEnum.ACTIVE,
        }),
      ];

      const mockPaginated = new PageCollection<Product>({
        content: mockProducts,
        currentPage: 1,
        pageSize: 2,
        totalElements: 10,
      });

      mockUseCase.execute.mockResolvedValue(mockPaginated);

      const mockPaginatedResponse =
        new PaginatedResponseDto<GetProductResponse>({
          content: mockProducts.map(
            (p) =>
              new GetProductResponse({
                id: p.id,
                category: p.category.getValue(),
                description: p.description,
                name: p.name,
                price: p.price.getValue(),
              }),
          ),
          currentPage: 1,
          pageSize: 2,
          totalElements: 10,
          totalPages: 5,
        });

      await controller.getProductsPaginated(query, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.send).toHaveBeenCalledWith(mockPaginatedResponse);
    });

    it('should return 204 when no products are found', async () => {
      const query: GetProductsQueryRequest = {
        page: 1,
        size: 2,
        category: ProductCategoryEnum.MAIN_COURSE,
      };

      mockUseCase.execute.mockResolvedValue(null);

      await controller.getProductsPaginated(query, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should throw a 500 error if an unexpected error occurs', async () => {
      const query: GetProductsQueryRequest = {
        page: 1,
        size: 2,
        category: ProductCategoryEnum.MAIN_COURSE,
      };

      mockUseCase.execute.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(
        controller.getProductsPaginated(query, mockResponse as Response),
      ).rejects.toThrow(HttpException);
      await expect(
        controller.getProductsPaginated(query, mockResponse as Response),
      ).rejects.toThrow('Database connection failed');
    });
  });
});
