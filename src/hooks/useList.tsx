import { useNavigate, useSearch } from '@tanstack/react-router';
import { useContext, createContext, useCallback } from 'react';

interface SortParams {
  sortBy: string;
  order: 'asc' | 'desc';
}
interface PaginationParams {
  limit: number;
  offset: number;
}
type ListParams<P> = Partial<P> & SortParams & PaginationParams;

interface ListContextType<T, P> {
  all: T[];
  list: T[];
  size: number;
  searchParams: ListParams<P>;
  setSearchParams: (searchParams: Partial<ListParams<P>>) => any;
}

const ListContext = createContext<ListContextType<any, any>>({
  all: [],
  list: [],
  size: 0,
  searchParams: { limit: Infinity, offset: 0, sortBy: '', order: 'asc' },
  setSearchParams: () => {},
});

export interface ListOptions<T, P> {
  all: T[];
  defaultLimit?: number;
  defaultOffset?: number;
  filter?: (list: T[], searchParams: ListParams<P>) => T[];
  sort?: (list: T[], sortBy: string, order: 'asc' | 'desc') => T[];
}

interface ListProviderProps<T, P> extends ListOptions<T, P> {
  children: React.ReactNode;
}

export function ListProvider<T, P>(props: ListProviderProps<T, P>) {
  const nav = useNavigate();
  const searchParams: ListParams<P> = useSearch({ strict: false });
  const setSearchParams = useCallback(
    (changes: Partial<ListParams<P>>) => {
      return nav({
        replace: true,
        resetScroll: false,
        params: (params) => params,
        search: (search) => {
          for (const [key, value] of Object.entries(changes)) {
            if (!value) {
              delete (changes as any)[key];
              if (key in search) delete (search as any)[key];
            }
          }
          return { ...search, ...changes };
        },
      });
    },
    [nav]
  );
  const {
    children,
    all,
    defaultLimit = 10,
    defaultOffset = 0,
    filter = (list) => list,
    sort = (list) => list,
  } = props;
  const {
    limit = defaultLimit,
    offset = defaultOffset,
    sortBy = '',
    order = 'asc',
    ...otherParams
  } = searchParams;
  const filtered = filter(all, searchParams);
  const sliced = filtered.slice(offset, offset + limit);
  const sorted = sort(sliced, sortBy, order);

  const ctx = {
    all,
    list: sorted,
    size: filtered.length,
    searchParams: {
      limit,
      offset,
      sortBy,
      order,
      ...otherParams,
    },
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
  const maxPage = Math.floor((size - limit) / limit) + 1;

  const setLimit = (limit: number) => setSearchParams({ limit });
  const setOffset = (offset: number) => setSearchParams({ offset });

  // Reset pagination to 0 when list size changes
  // TODO: prevent this to be triggered on navigation
  // useEffect(() => {
  //   setSearchParams({ offset: 0 });
  // }, [size, setSearchParams]);

  return {
    limit,
    offset,
    currentPage,
    maxPage,
    setLimit,
    setOffset,
    firstPage: () => setOffset(0),
    lastPage: () => setOffset(size - limit),
    previousPage: () => setOffset(Math.max(0, offset - limit)),
    nextPage: () => setOffset(Math.min(size - limit, offset + limit)),
  };
}
