import { ApiProperty } from '@nestjs/swagger';

export class Erros4xx5xxResponse {
  @ApiProperty({ example: 400, description: 'HTTP status code of the error' })
  statusCode: number;

  @ApiProperty({
    example: 'Error occurred while processing the request',
    description: 'Generic error message',
  })
  message: string;

  @ApiProperty({
    example: '2025-02-01T23:28:18.000Z',
    description: 'Timestamp when the error occurred',
  })
  timestamp: string;

  @ApiProperty({
    example: '/cook/v1/resource',
    description: 'Path of the API endpoint where the error occurred',
  })
  path: string;
}
