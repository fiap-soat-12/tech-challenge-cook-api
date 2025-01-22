import { ProductCategoryType } from '@application/types/product-category.type';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateProductRequest {
  @ApiProperty({ example: 'Pizza', description: 'The name of the product' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 'MAIN_COURSE',
    description: 'The category of the product',
  })
  @IsEnum(['MAIN_COURSE', 'SIDE_DISH', 'DRINK', 'DESSERT'], {
    message: 'category must be one of MAIN_COURSE, SIDE_DISH, DRINK, DESSERT',
  })
  category: ProductCategoryType;

  @ApiProperty({ example: 19.99, description: 'The price of the product' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 'Delicious margherita pizza',
    description: 'Description of the product',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @ApiProperty({ example: 'ACTIVE', description: 'The status of the product' })
  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE'], {
    message: 'Status must be ACTIVE or INACTIVE',
  })
  status?: string;
}
