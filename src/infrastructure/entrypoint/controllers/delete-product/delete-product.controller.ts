import { DeleteProductUseCase } from '@application/usecases/products/delete-product/delete-product.usecase';
import { Controller, Delete, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Product')
@ApiBearerAuth('Authorization')
@Controller('products')
export class DeleteProductController {
  constructor(private readonly deleteProductUseCase: DeleteProductUseCase) {}

  @ApiOperation({ summary: 'Delete a Product By ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteProductUseCase.execute(id);
  }
}
