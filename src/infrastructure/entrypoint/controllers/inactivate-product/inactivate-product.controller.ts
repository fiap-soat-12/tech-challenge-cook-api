import { UUID } from '@application/types/UUID.type';
import { InactivateProductUseCase } from '@application/usecases/products/delete-product/delete-product.usecase';
import { ProductNotFoundException } from '@domain/exceptions/product-not-found.exception';
import { Erros4xx5xxResponse } from '@infrastructure/entrypoint/response/errors-4xx-5xx.response';
import { UUIDValidationPipe } from '@infrastructure/entrypoint/validators/null-or-valid-uuid/null-or-valid-uuid.validator';
import { Controller, Delete, HttpException, Param } from '@nestjs/common';
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
export class InactivateProductController {
  constructor(
    private readonly deleteProductUseCase: InactivateProductUseCase,
  ) {}

  @ApiOperation({ summary: 'Delete a Product By ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
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
    description: 'UUID of the product to delete',
    example: 'a6b9e046-fb5a-4a79-9d86-363e6fd20e11',
    type: 'string',
  })
  @Delete(':id')
  async delete(@Param('id', UUIDValidationPipe) id: UUID): Promise<void> {
    try {
      await this.deleteProductUseCase.execute(id);
    } catch (error) {
      if (error instanceof ProductNotFoundException) {
        throw new HttpException(error.message, 404);
      }
      throw new HttpException(error.message, 500);
    }
  }
}
