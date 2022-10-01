import { PagedList } from '../models/pagination/paged-list';

export function emptyPagedList<T = any>(): PagedList<T> {
  return {
    data: [],
    pagination: {
      currentPage: 0,
      hasNext: false,
      hasPrevious: false,
      itemsCount: 0,
      totalItemsCount: 0,
      totalPages: 0,
    },
  };
}
