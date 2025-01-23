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
  @ApiResponse({ status: 200, description: 'Products retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getProductsPaginated(
    @Query() query: GetProductsQueryRequest,
    @Res() res: Response<PaginatedResponseDto<GetProductResponse>>,
  ) {
    const productPaginated = await this.usecase.execute({
      page: Number(query.page),
      size: Number(query.size),
      category: query.category,
    });

    if (!productPaginated) {
      res.status(HttpStatus.NO_CONTENT).send();
    }

    try {
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
      return;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
