import { GetProductPaginatedUseCase } from '@application/usecases/products/get-product-paginated/get-product-paginated.usecase';
import { GetProductsQueryRequest } from '@infrastructure/entrypoint/request/get-products-query.request';
import { PaginatedResponseDto } from '@infrastructure/entrypoint/request/paginated.request';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { GetProductResponse } from '../../response/get-product.response';

@ApiTags('Product')
@ApiBearerAuth('Authorization')
@Controller('products')
export class GetProductPaginatedController {
  constructor(private readonly usecase: GetProductPaginatedUseCase) {}

  @Get('/category')
  @ApiOperation({ summary: 'Find a Product By Category' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully.',
    schema: {
      example: {
        content: [
          {
            id: '7901cbdc-2d24-4faf-aadd-995a7bcc6b5b',
            name: 'Hambúrguer Clássico',
            category: 'MAIN_COURSE',
            description: 'Hambúrguer com carne bovina, queijo e salada',
            price: '30.00',
          },
        ],
        currentPage: 0,
        pageSize: 1,
        totalElements: 31,
        totalPages: 31,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getProductsPaginated(
    @Query() query: GetProductsQueryRequest,
    @Res() res: Response<PaginatedResponseDto<GetProductResponse>>,
  ) {
    try {
      const productPaginated = await this.usecase.execute({
        page: Number(query.page),
        size: Number(query.size),
        category: query.category,
      });

      if (!productPaginated) {
        return res.status(HttpStatus.NO_CONTENT).send();
      }

      const products: GetProductResponse[] = productPaginated.content.map(
        (value) =>
          new GetProductResponse({
            id: value.id,
            category: value.category.getValue(),
            description: value.description,
            name: value.name,
            price: value.price.getValue(),
          }),
      );

      res.status(HttpStatus.OK).send({
        content: products,
        currentPage: productPaginated.currentPage,
        pageSize: productPaginated.pageSize,
        totalElements: productPaginated.totalElements,
        totalPages: productPaginated.totalPages,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
