import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class GetProductsQueryRequest {
  @IsEnum(['MAIN_COURSE', 'SIDE_DISH', 'DRINK', 'DESSERT'], {
    message: 'Invalid category',
  })
  @ApiPropertyOptional({
    description: 'Category of the product',
    enum: ['MAIN_COURSE', 'SIDE_DISH', 'DRINK', 'DESSERT'],
  })
  category: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 0,
    default: 0,
  })
  page: number = 0;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Number of products per page',
    example: 10,
    default: 10,
  })
  size: number = 10;
}
