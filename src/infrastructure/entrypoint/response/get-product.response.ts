import { ApiProperty } from '@nestjs/swagger';

export class GetProductResponse {
  @ApiProperty({
    description: 'Unique identifier of the product',
    example: 'ab69e046-fb5a-4a79-9d86-363e6fdf20e11',
  })
  public readonly id: string;

  @ApiProperty({
    description: 'Name of the product',
    example: 'Cheese Hamburger',
  })
  public readonly name: string;

  @ApiProperty({
    description: 'Category of the product',
    example: 'MAIN_COURSE',
  })
  public readonly category: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 25.9,
  })
  public readonly price: number;

  @ApiProperty({
    description: 'Description of the product',
    example: 'Hamburger with Cheese',
  })
  public readonly description: string;

  constructor(props: Partial<GetProductResponse>) {
    Object.assign(this, props);
  }
}
