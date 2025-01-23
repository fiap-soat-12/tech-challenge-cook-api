import { CreateProductUseCase } from '@application/usecases/products/create-product/create-product.usecase';
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProductRequest } from '../../request/create-product.request';
import { GetProductResponse } from '../../response/get-product.response';

@ApiTags('Product')
@ApiBearerAuth('Authorization')
@Controller('products')
export class CreateProductController {
  constructor(private readonly createUserUseCase: CreateProductUseCase) {}

  @ApiOperation({ summary: 'Register a Product' })
  @ApiResponse({ status: 201, description: 'Product successfully created.' })
  @Post()
  async createUser(
    @Body() request: CreateProductRequest,
  ): Promise<GetProductResponse> {
    const product = await this.createUserUseCase.execute(request);
    const response: GetProductResponse = new GetProductResponse({
      category: product.category.getValue(),
      description: product.description,
      name: product.name,
      price: product.price.getValue(),
    });

    return response;
  }
}
