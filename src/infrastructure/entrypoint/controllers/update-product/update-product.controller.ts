import { UUID } from '@application/types/UUID.type';
import { UpdateProductUseCase } from '@application/usecases/products/update-product/update-product.usecase';
import { ProductNotFoundException } from '@domain/exceptions/product-not-found.exception';
import { UpdateProductRequest } from '@infrastructure/entrypoint/request/update-product.request';
import { Erros4xx5xxResponse } from '@infrastructure/entrypoint/response/errors-4xx-5xx.response';
import { GetProductResponse } from '@infrastructure/entrypoint/response/get-product.response';
import { UUIDValidationPipe } from '@infrastructure/entrypoint/validators/null-or-valid-uuid/null-or-valid-uuid.validator';
import { Body, Controller, HttpException, Param, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Product')
@ApiBearerAuth('Authorization')
@Controller('products')
export class UpdateProductController {
  constructor(private readonly updateProductUseCase: UpdateProductUseCase) {}

  @ApiOperation({ summary: 'Update a Product By ID' })
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the product to update',
    example: 'a6b9e046-fb5a-4a79-9d86-363e6fd20e11',
    type: 'string',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: Erros4xx5xxResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Resource Not Found',
    type: Erros4xx5xxResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: Erros4xx5xxResponse,
  })
  @Put(':id')
  async update(
    @Param('id', UUIDValidationPipe) id: UUID,
    @Body() dto: UpdateProductRequest,
  ): Promise<GetProductResponse> {
    try {
      const updatedProduct = await this.updateProductUseCase.execute(id, dto);

      return new GetProductResponse({
        id: updatedProduct.id,
        category: updatedProduct.category.getValue(),
        description: updatedProduct.description,
        name: updatedProduct.name,
        price: updatedProduct.price.getValue(),
      });
    } catch (error) {
      if (error instanceof ProductNotFoundException) {
        throw new HttpException(error.message, 404);
      }
      throw new HttpException(error.message, 500);
    }
  }
}
