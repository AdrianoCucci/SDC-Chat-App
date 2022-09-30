import { PaginateMeta } from './paginate-meta';

export interface PagedList<T = any> {
  readonly data: T[];
  readonly pagination: PaginateMeta;
}
