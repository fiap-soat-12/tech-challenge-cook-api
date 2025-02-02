import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'List of items in the current page',
    isArray: true,
  })
  content: T[];

  @ApiProperty({ description: 'Current page number', example: 0 })
  currentPage: number;

  @ApiProperty({ description: 'Number of items per page', example: 1 })
  pageSize: number;

  @ApiProperty({ description: 'Total number of elements', example: 31 })
  totalElements: number;

  @ApiProperty({ description: 'Total number of pages', example: 31 })
  totalPages: number;

  constructor(
    content: T[],
    currentPage: number,
    pageSize: number,
    totalElements: number,
    totalPages: number,
  ) {
    this.content = content;
    this.currentPage = currentPage;
    this.pageSize = pageSize;
    this.totalElements = totalElements;
    this.totalPages = totalPages;
  }
}
