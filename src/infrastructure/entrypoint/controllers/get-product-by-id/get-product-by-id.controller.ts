import { UUID } from '@application/types/UUID.type';
import { GetProductByIdUseCase } from '@application/usecases/products/get-product-by-id/get-product-by-id.usecase';
import { ProductNotFoundException } from '@domain/exceptions/product-not-found.exception';
import { Erros4xx5xxResponse } from '@infrastructure/entrypoint/response/errors-4xx-5xx.response';
import { UUIDValidationPipe } from '@infrastructure/entrypoint/validators/null-or-valid-uuid/null-or-valid-uuid.validator';
import { Controller, Get, HttpException, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetProductResponse } from '../../response/get-product.response';

@ApiTags('Product')
@ApiBearerAuth('Authorization')
@Controller('products')
export class GetProductByIdController {
  constructor(private readonly usecase: GetProductByIdUseCase) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a Product By ID' })
  @ApiResponse({
    status: 200,
    description: 'Product found.',
    type: GetProductResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: Erros4xx5xxResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
    type: Erros4xx5xxResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: Erros4xx5xxResponse,
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the product to inactivate',
    example: 'a6b9e046-fb5a-4a79-9d86-363e6fd20e11',
    type: 'string',
  })
  async getProductById(
    @Param('id', UUIDValidationPipe) id: UUID,
  ): Promise<GetProductResponse> {
    try {
      const products = await this.usecase.execute(id);
      return new GetProductResponse({
        id: products.id,
        category: products.category.getValue(),
        description: products.description,
        name: products.name,
        price: products.price.getValue(),
      });
    } catch (error) {
      if (error instanceof ProductNotFoundException) {
        throw new HttpException(error.message, 404);
      }
      throw new HttpException(error.message, 500);
    }
  }
}
