export class PageCollection<T> {
  readonly content: T[];
  readonly totalPages: number;
  readonly totalElements: number;
  readonly currentPage: number;
  readonly pageSize: number;

  constructor({
    content = [],
    totalElements = 0,
    currentPage = 0,
    pageSize = 10,
  }: {
    content?: T[];
    totalElements?: number;
    currentPage?: number;
    pageSize?: number;
  } = {}) {
    this.content = content;
    this.totalElements = totalElements;
    this.pageSize = pageSize;
    this.currentPage = currentPage < 0 ? 0 : currentPage;

    this.totalPages = Math.ceil(this.totalElements / this.pageSize);
  }

  hasNext(): boolean {
    return this.currentPage < this.totalPages - 1;
  }

  hasPrevious(): boolean {
    return this.currentPage > 0;
  }

  nextPage(): number {
    return this.hasNext() ? this.currentPage + 1 : this.currentPage;
  }

  previousPage(): number {
    return this.hasPrevious() ? this.currentPage - 1 : this.currentPage;
  }

  toJSON(): object {
    return {
      content: this.content,
      totalPages: this.totalPages,
      totalElements: this.totalElements,
      currentPage: this.currentPage,
      pageSize: this.pageSize,
    };
  }
}
