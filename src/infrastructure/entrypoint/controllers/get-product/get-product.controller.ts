import { GetProductUseCase } from '@application/usecases/products/get-product/get-product.usecase';
import { Controller, Get, HttpException } from '@nestjs/common';
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
export class GetProductController {
  constructor(private readonly getProductUseCase: GetProductUseCase) {}

  @ApiOperation({ summary: 'Find a Product By Category' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully.',
    type: GetProductResponse,
    isArray: true,
  })
  @Get()
  async getProducts(): Promise<GetProductResponse[]> {
    const products = await this.getProductUseCase.execute();

    try {
      const response: GetProductResponse[] = products.map((value) => {
        return new GetProductResponse({
          id: value.id,
          category: value.category.getValue(),
          description: value.description,
          name: value.name,
          price: value.price.getValue(),
        });
      });

      return response;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
