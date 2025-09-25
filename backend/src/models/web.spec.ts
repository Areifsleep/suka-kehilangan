import { WebResponseModel } from './web';

describe('Models - Web', () => {
  describe('WebResponseModel', () => {
    it('should create an instance', () => {
      const response = new WebResponseModel<string>();
      expect(response).toBeDefined();
      expect(response).toBeInstanceOf(WebResponseModel);
    });

    it('should allow setting data', () => {
      const response = new WebResponseModel<string>();
      response.data = 'test data';

      expect(response.data).toBe('test data');
    });

    it('should allow setting pagination to null', () => {
      const response = new WebResponseModel<string>();
      response.pagination = null;

      expect(response.pagination).toBeNull();
    });

    it('should allow setting pagination object', () => {
      const response = new WebResponseModel<string>();
      const pagination = {
        total: 100,
        page: 1,
        pageSize: 10,
        hasNextPage: true,
        hasPreviousPage: false,
      };

      response.pagination = pagination;

      expect(response.pagination).toEqual(pagination);
    });

    it('should work with different data types', () => {
      // Test with object data
      const objectResponse = new WebResponseModel<{
        id: number;
        name: string;
      }>();
      objectResponse.data = { id: 1, name: 'test' };

      expect(objectResponse.data).toEqual({ id: 1, name: 'test' });

      // Test with array data
      const arrayResponse = new WebResponseModel<number[]>();
      arrayResponse.data = [1, 2, 3];

      expect(arrayResponse.data).toEqual([1, 2, 3]);

      // Test with boolean data
      const booleanResponse = new WebResponseModel<boolean>();
      booleanResponse.data = true;

      expect(booleanResponse.data).toBe(true);
    });

    it('should handle complete pagination data', () => {
      const response = new WebResponseModel<string[]>();
      response.data = ['item1', 'item2'];
      response.pagination = {
        total: 50,
        page: 2,
        pageSize: 20,
        hasNextPage: true,
        hasPreviousPage: true,
      };

      expect(response.data).toEqual(['item1', 'item2']);
      expect(response.pagination.total).toBe(50);
      expect(response.pagination.page).toBe(2);
      expect(response.pagination.pageSize).toBe(20);
      expect(response.pagination.hasNextPage).toBe(true);
      expect(response.pagination.hasPreviousPage).toBe(true);
    });
  });
});
