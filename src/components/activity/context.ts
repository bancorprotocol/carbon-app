import { FetchStatus } from '@tanstack/react-query';
import {
  Activity,
  ActivityMeta,
  QueryActivityParams,
} from 'libs/queries/extApi/activity';
import { ActivitySearchParams } from './utils';
import { createContext, useContext } from 'react';

export interface ActivityContextType {
  activities: Activity[];
  meta?: ActivityMeta;
  size?: number;
  status: 'error' | 'pending' | 'success';
  fetchStatus: FetchStatus;
  queryParams: QueryActivityParams;
  searchParams: Partial<ActivitySearchParams>;
  setSearchParams: (searchParams: Partial<ActivitySearchParams>) => any;
}

export const ActivityContext = createContext<ActivityContextType>({
  activities: [],
  status: 'pending',
  fetchStatus: 'idle',
  queryParams: {},
  searchParams: { limit: 10, offset: 0 },
  setSearchParams: () => {},
});

export function useActivity(): ActivityContextType {
  const ctx = useContext(ActivityContext) as any;
  if (!ctx) {
    throw new Error('useActivity must be used within a ActivityProvider');
  }
  return ctx;
}

export function useActivityPagination() {
  const { size = 0, searchParams, setSearchParams } = useActivity();
  const { limit = 10, offset = 0 } = searchParams;

  const currentPage = Math.floor(offset / limit) + 1;
  const maxPage = Math.ceil(size / limit);
  const maxOffset = Math.max((maxPage - 1) * limit, 0);

  const setLimit = (limit: number) => setSearchParams({ limit });
  const setOffset = (offset: number) => setSearchParams({ offset });

  return {
    size,
    limit,
    offset,
    currentPage,
    maxPage,
    setLimit,
    setOffset,
    firstPage: () => setOffset(0),
    lastPage: () => setOffset(maxOffset),
    previousPage: () => setOffset(Math.max(offset - limit, 0)),
    nextPage: () => setOffset(Math.min(offset + limit, maxOffset)),
  };
}
