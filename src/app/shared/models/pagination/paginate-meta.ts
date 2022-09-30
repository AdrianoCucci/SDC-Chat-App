import { Paginatable } from './paginatable';

export interface PaginateMeta extends Paginatable {
  readonly skip?: number;
  readonly take?: number;

  readonly itemsCount: number;
  readonly totalItemsCount: number;

  readonly currentPage: number;
  readonly totalPages: number;

  readonly hasNext: boolean;
  readonly hasPrevious: boolean;
}
