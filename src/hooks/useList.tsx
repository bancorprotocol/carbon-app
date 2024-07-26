import { FetchStatus } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useContext, createContext, useCallback, useEffect } from 'react';
import {
  GroupSchema,
  parseSchema,
  toLiteral,
  toString,
  toNumber,
  SearchParams,
} from 'utils/helpers';
import { isEmpty } from 'utils/helpers/operators';

interface SortParams {
  sortBy: string;
  order: 'asc' | 'desc';
}
interface PaginationParams {
  limit: number;
  offset: number;
}

const sortSchema = (
  defaultSortBy: string,
  defaultOrder: 'asc' | 'desc'
): GroupSchema<SortParams> => ({
  sortBy: toString(defaultSortBy),
  order: toLiteral(['asc', 'desc'], defaultOrder),
});
const paginationSchema = (
  defaultLimit: number,
  defaultOffset: number
): GroupSchema<PaginationParams> => ({
  limit: toNumber(defaultLimit),
  offset: toNumber(defaultOffset),
});

type ListParams<P> = P & SortParams & PaginationParams;

interface ListContextType<T, P> {
  status: FetchStatus;
  all: T[];
  list: T[];
  size: number;
  searchParams: ListParams<P>;
  setSearchParams: (searchParams: Partial<ListParams<P>>) => any;
}

const ListContext = createContext<ListContextType<any, any>>({
  status: 'idle',
  all: [],
  list: [],
  size: 0,
  searchParams: { limit: Infinity, offset: 0, sortBy: '', order: 'asc' },
  setSearchParams: () => {},
});

export interface ListOptions<T, P> {
  all: T[];
  status: FetchStatus;
  schema: GroupSchema<P>;
  defaultLimit?: number;
  defaultOffset?: number;
  filter?: (list: T[], searchParams: ListParams<P>) => T[];
  sort?: (list: T[], sortBy: string, order: 'asc' | 'desc') => T[];
}

interface ListProviderProps<T, P> extends ListOptions<T, P> {
  children: React.ReactNode;
}

export function ListProvider<T, P>(props: ListProviderProps<T, P>) {
  const {
    children,
    all,
    status,
    schema,
    defaultLimit = 10,
    defaultOffset = 0,
    filter = (list) => list,
    sort = (list) => list,
  } = props;

  // Get params from URL as string
  const params: SearchParams<ListParams<P>> = useSearch({ strict: false });

  // Parse and validate params
  const searchParams = parseSchema<ListParams<P>>(
    {
      ...sortSchema('', 'asc'),
      ...paginationSchema(defaultLimit, defaultOffset),
      ...schema,
    } as any,
    params
  );

  const nav = useNavigate();
  const setSearchParams = useCallback(
    (changes: Partial<ListParams<P>>) => {
      return nav({
        replace: true,
        resetScroll: false,
        params: (params) => params,
        search: (currentSearch) => {
          const updates = structuredClone(changes);
          const search = structuredClone(currentSearch);
          for (const [key, value] of Object.entries(changes)) {
            if (isEmpty(value)) {
              delete (updates as any)[key];
              if (key in search) delete (search as any)[key];
            }
          }
          return { ...search, ...updates };
        },
      });
    },
    [nav]
  );

  // Filter, slice & sort the list
  const { limit, offset, order, sortBy } = searchParams;
  const filtered = filter(all, searchParams);
  const sliced = filtered.slice(offset, offset + limit);
  const sorted = sort(sliced, sortBy, order);

  const ctx = {
    all,
    status,
    list: sorted,
    size: filtered.length,
    searchParams,
    setSearchParams,
  };

  return <ListContext.Provider value={ctx}>{children}</ListContext.Provider>;
}

export function useList<T = unknown, P = unknown>(): ListContextType<T, P> {
  const ctx = useContext(ListContext) as any;
  if (!ctx) {
    throw new Error('useList/usePagination must be used within a ListProvider');
  }
  return ctx;
}

export function useSort() {
  const { searchParams, setSearchParams } = useList();

  return {
    sortBy: searchParams.sortBy,
    order: searchParams.order,
    setSort: (sortBy: string) => setSearchParams({ sortBy }),
    setOrder: (order: 'asc' | 'desc') => setSearchParams({ order }),
  };
}

export function usePagination() {
  const { size, searchParams, setSearchParams } = useList();
  const { limit, offset } = searchParams;

  const currentPage = Math.floor(offset / limit) + 1;
  const maxPage = Math.ceil(size / limit);

  const setLimit = (limit: number) => setSearchParams({ limit });
  const setOffset = (offset: number) => setSearchParams({ offset });

  // Remove offset when list size changes
  useEffect(() => {
    setSearchParams({ offset: undefined });
  }, [size, setSearchParams]);

  return {
    size,
    limit,
    offset,
    currentPage,
    maxPage,
    setLimit,
    setOffset,
    firstPage: () => setOffset(0),
    lastPage: () => setOffset((maxPage - 1) * limit),
    previousPage: () => setOffset(Math.max(offset - limit, 0)),
    nextPage: () => setOffset(Math.min(offset + limit, (maxPage - 1) * limit)),
  };
}
