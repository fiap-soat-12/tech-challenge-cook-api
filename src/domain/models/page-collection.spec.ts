import { PageCollection } from './page-collection';

describe('PageCollection', () => {
  const mockContent = ['item1', 'item2', 'item3'];

  describe('constructor', () => {
    it('should create a PageCollection with default values when no parameters are provided', () => {
      const pageCollection = new PageCollection();

      expect(pageCollection.content).toEqual([]);
      expect(pageCollection.totalElements).toBe(0);
      expect(pageCollection.currentPage).toBe(0);
      expect(pageCollection.pageSize).toBe(10);
      expect(pageCollection.totalPages).toBe(0);
    });

    it('should create a PageCollection with the provided values', () => {
      const pageCollection = new PageCollection({
        content: mockContent,
        totalElements: 30,
        currentPage: 2,
        pageSize: 10,
      });

      expect(pageCollection.content).toEqual(mockContent);
      expect(pageCollection.totalElements).toBe(30);
      expect(pageCollection.currentPage).toBe(2);
      expect(pageCollection.pageSize).toBe(10);
      expect(pageCollection.totalPages).toBe(3);
    });

    it('should set currentPage to 0 if a negative currentPage is provided', () => {
      const pageCollection = new PageCollection({
        currentPage: -1,
      });

      expect(pageCollection.currentPage).toBe(0);
    });

    it('should calculate totalPages correctly', () => {
      const pageCollection = new PageCollection({
        totalElements: 45,
        pageSize: 10,
      });

      expect(pageCollection.totalPages).toBe(5);
    });
  });

  describe('hasNext', () => {
    it('should return true if there is a next page', () => {
      const pageCollection = new PageCollection({
        currentPage: 0,
        totalElements: 30,
        pageSize: 10,
      });

      expect(pageCollection.hasNext()).toBe(true);
    });

    it('should return false if there is no next page', () => {
      const pageCollection = new PageCollection({
        currentPage: 2,
        totalElements: 30,
        pageSize: 10,
      });

      expect(pageCollection.hasNext()).toBe(false);
    });
  });

  describe('hasPrevious', () => {
    it('should return true if there is a previous page', () => {
      const pageCollection = new PageCollection({
        currentPage: 1,
        totalElements: 30,
        pageSize: 10,
      });

      expect(pageCollection.hasPrevious()).toBe(true);
    });

    it('should return false if there is no previous page', () => {
      const pageCollection = new PageCollection({
        currentPage: 0,
        totalElements: 30,
        pageSize: 10,
      });

      expect(pageCollection.hasPrevious()).toBe(false);
    });
  });

  describe('nextPage', () => {
    it('should return the next page number if there is a next page', () => {
      const pageCollection = new PageCollection({
        currentPage: 0,
        totalElements: 30,
        pageSize: 10,
      });

      expect(pageCollection.nextPage()).toBe(1);
    });

    it('should return the current page number if there is no next page', () => {
      const pageCollection = new PageCollection({
        currentPage: 2,
        totalElements: 30,
        pageSize: 10,
      });

      expect(pageCollection.nextPage()).toBe(2);
    });
  });

  describe('previousPage', () => {
    it('should return the previous page number if there is a previous page', () => {
      const pageCollection = new PageCollection({
        currentPage: 2,
        totalElements: 30,
        pageSize: 10,
      });

      expect(pageCollection.previousPage()).toBe(1);
    });

    it('should return the current page number if there is no previous page', () => {
      const pageCollection = new PageCollection({
        currentPage: 0,
        totalElements: 30,
        pageSize: 10,
      });

      expect(pageCollection.previousPage()).toBe(0);
    });
  });

  describe('toJSON', () => {
    it('should return a JSON representation of the PageCollection', () => {
      const pageCollection = new PageCollection({
        content: mockContent,
        totalElements: 30,
        currentPage: 2,
        pageSize: 10,
      });

      expect(pageCollection.toJSON()).toEqual({
        content: mockContent,
        totalElements: 30,
        totalPages: 3,
        currentPage: 2,
        pageSize: 10,
      });
    });
  });
});
