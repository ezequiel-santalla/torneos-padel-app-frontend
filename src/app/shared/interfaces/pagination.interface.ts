export interface Pagination {
  currentPage:   number;
  totalPages:    number;
  totalElements: number;
  pageSize:      number;
  hasNext:       boolean;
  hasPrevious:   boolean;
  first:         boolean;
  last:          boolean;
}

export interface PaginationOptions {
  size?: number;
  page?: number;
}
