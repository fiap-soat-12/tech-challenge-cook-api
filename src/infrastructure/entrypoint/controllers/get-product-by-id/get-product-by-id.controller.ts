import { GetProductByIdUseCase } from '@application/usecases/products/get-product-by-id/get-product-by-id.usecase';
import { ProductNotFoundException } from '@domain/exceptions/product-not-found.exception';
import { Controller, Get, HttpException, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
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
  @ApiResponse({ status: 200, description: 'Product found.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async getProductById(@Param('id') id: string): Promise<GetProductResponse> {
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
