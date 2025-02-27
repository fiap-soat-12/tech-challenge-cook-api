import { ProductCategoryEnum } from '@application/enums/product-category.enum';
import { ProductCategoryType } from '@application/types/product-category.type';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductRequest {
  @ApiProperty({ example: 'Pizza', description: 'The name of the product' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 'MAIN_COURSE',
    description: 'The category of the product',
  })
  @IsEnum(ProductCategoryEnum, {
    message: `category must be one of ${Object.values(ProductCategoryEnum).join(', ')}`,
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
}
