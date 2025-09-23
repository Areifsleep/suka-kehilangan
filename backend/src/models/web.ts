type PaginationType = {
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export class WebResponseModel<T> {
  data: T;
  pagination: PaginationType | null;
}
