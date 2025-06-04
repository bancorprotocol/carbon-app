import { FC, ReactNode, createContext, useCallback, useContext } from 'react';
import {
  Activity,
  ActivityMeta,
  QueryActivityParams,
} from 'libs/queries/extApi/activity';
import { ActivitySearchParams } from './utils';
import { useActivityQuery, useActivityMetaQuery } from './useActivityQuery';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { isEmpty } from 'utils/helpers/operators';
import { addDays, getUnixTime } from 'date-fns';
import { FetchStatus } from '@tanstack/react-query';

interface ActivityContextType {
  activities: Activity[];
  meta?: ActivityMeta;
  size?: number;
  status: 'error' | 'pending' | 'success';
  fetchStatus: FetchStatus;
  queryParams: QueryActivityParams;
  searchParams: Partial<ActivitySearchParams>;
  setSearchParams: (searchParams: Partial<ActivitySearchParams>) => any;
}

const ActivityContext = createContext<ActivityContextType>({
  activities: [],
  status: 'pending',
  fetchStatus: 'idle',
  queryParams: {},
  searchParams: { limit: 10, offset: 0 },
  setSearchParams: () => {},
});

const getQueryParams = (
  baseParams: QueryActivityParams,
  searchParams: ActivitySearchParams,
) => {
  const params = { ...baseParams };
  if (searchParams.actions) params.actions = searchParams.actions.join(',');
  if (searchParams.ids) params.strategyIds = searchParams.ids?.join(',');
  if (searchParams.pairs) params.pairs = searchParams.pairs.join(',');
  if (searchParams.start)
    params.start = getUnixTime(new Date(searchParams.start));
  if (searchParams.end)
    params.end = getUnixTime(addDays(new Date(searchParams.end), 1));

  for (const key in params) {
    if (isEmpty(params[key as ParamsKey])) delete params[key as ParamsKey];
  }
  return params;
};

type ActivityUrls =
  | '/portfolio/strategies/activity'
  | '/explore/$slug/activity'
  | '/strategy/$id';
interface Props {
  url: ActivityUrls;
  params: QueryActivityParams;
  children: ReactNode;
}
type ParamsKey = Extract<keyof QueryActivityParams, string>;
export const ActivityProvider: FC<Props> = ({ children, params, url }) => {
  const nav = useNavigate({ from: url });
  const searchParams: ActivitySearchParams = useSearch({ strict: false });
  const limit = searchParams.limit;
  const offset = searchParams.offset;

  const queryParams = getQueryParams(params, searchParams);
  // Query the list
  const activityQuery = useActivityQuery({ ...queryParams, limit, offset });
  // Query the size of items in the list
  const activitySizeQuery = useActivityMetaQuery(queryParams);
  // Query the filtering option for the root query. We need to query with different params to make sure we've got
  // all filtering items for the base query
  // Note: This could be improved in the backend with a single request, but at the time of writing this code, this was not an option
  const activityMetaQuery = useActivityMetaQuery(params);

  const setSearchParams = useCallback(
    (changes: Partial<ActivitySearchParams>) => {
      return nav({
        replace: true,
        resetScroll: false,
        params: (params) => params,
        search: (current) => ({ ...current, ...changes }),
      });
    },
    [nav],
  );

  if (activityMetaQuery.isPending) {
    return <CarbonLogoLoading className="h-[80px] self-center" />;
  }

  const activities = activityQuery.data ?? [];
  const size = activitySizeQuery.data?.size;
  const meta = activityMetaQuery.data;

  const ctx: ActivityContextType = {
    activities,
    status: activityQuery.status,
    fetchStatus: activityQuery.fetchStatus,
    meta: meta,
    size: size,
    queryParams,
    searchParams,
    setSearchParams,
  };

  return (
    <ActivityContext.Provider value={ctx}>{children}</ActivityContext.Provider>
  );
};

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
