import { UpdateProductDto } from '@application/dto/update-product.dto';
import { UpdateProductUseCase } from '@application/usecases/products/update-product/update-product.usecase';
import { ProductNotFoundException } from '@domain/exceptions/product-not-found.exception';
import { GetProductResponse } from '@infrastructure/entrypoint/response/get-product.response';
import { Body, Controller, HttpException, Param, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
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
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
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
