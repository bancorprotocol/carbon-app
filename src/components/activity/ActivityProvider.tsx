import {
  Activity,
  ActivityMeta,
  QueryActivityParams,
} from 'libs/queries/extApi/activity';
import { ActivitySearchParams } from './utils';
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { useActivityQuery, useActivityMetaQuery } from './useActivityQuery';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { NotFound } from 'components/common/NotFound';
import { useGetUserStrategies } from 'libs/queries';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { isEmpty } from 'utils/helpers/operators';
import { addDays, getUnixTime } from 'date-fns';
import { FetchStatus } from '@tanstack/react-query';

interface ActivityContextType {
  activities: Activity[];
  meta?: ActivityMeta;
  status: FetchStatus;
  searchParams: ActivitySearchParams;
  setSearchParams: (searchParams: Partial<ActivitySearchParams>) => any;
}

const ActivityContext = createContext<ActivityContextType>({
  activities: [],
  status: 'idle',
  searchParams: { limit: 10, offset: 0 },
  setSearchParams: () => {},
});

const getQueryParams = (
  baseParams: QueryActivityParams,
  searchParams: ActivitySearchParams
) => {
  const params = { ...baseParams };
  if (searchParams.actions) params.actions = searchParams.actions.join(',');
  if (searchParams.ids) params.strategyIds = searchParams.ids?.join(',');
  if (searchParams.pairs)
    params.pairs = searchParams.pairs
      .map((pair) => `${pair[0]}_${pair[1]}`)
      .join(',');
  if (searchParams.start)
    params.start = getUnixTime(new Date(searchParams.start));
  if (searchParams.end)
    params.end = getUnixTime(addDays(new Date(searchParams.end), 1));

  for (const key in params) {
    if (isEmpty(params[key as ParamsKey])) delete params[key as ParamsKey];
  }
  return params;
};

interface Props {
  params: QueryActivityParams;
  empty?: ReactNode;
  children: ReactNode;
}
type ParamsKey = Extract<keyof QueryActivityParams, string>;
export const ActivityProvider: FC<Props> = ({ children, params, empty }) => {
  const nav = useNavigate();
  const search: ActivitySearchParams = useSearch({ strict: false });
  const searchParams = {
    ...search,
    limit: search.limit ? Number(search.limit) : 10,
    offset: search.offset ? Number(search.offset) : 0,
  };

  const limit = searchParams.limit;
  const offset = searchParams.offset;

  const queryParams = getQueryParams(params, searchParams);
  const activityQuery = useActivityQuery({ ...queryParams, limit, offset });
  const activityMetaQuery = useActivityMetaQuery(queryParams);

  const userStrategiesQuery = useGetUserStrategies({
    user: queryParams.ownerId,
  });

  const setSearchParams = useCallback(
    (changes: Partial<ActivitySearchParams>) => {
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

  const isPending = activityQuery.isPending || userStrategiesQuery.isPending;

  if (isPending) {
    return <CarbonLogoLoading className="h-[80px] self-center" />;
  }
  const activities = activityQuery.data ?? [];
  const meta = activityMetaQuery.data;

  if (!activities.length) {
    if (empty) {
      const userStrategies = userStrategiesQuery.data;
      const userHasNoStrategies =
        userStrategiesQuery.isFetched &&
        (!userStrategies || userStrategies.length === 0);
      if (userHasNoStrategies) return empty;
    }
    return (
      <NotFound
        variant="error"
        title="We couldn't find any activities"
        text="Try entering a different wallet address or choose a different token pair."
        bordered
      />
    );
  }

  const ctx: ActivityContextType = {
    activities,
    status: activityQuery.fetchStatus,
    meta: meta,
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
  const { meta, searchParams, setSearchParams } = useActivity();
  const { limit = 10, offset = 0 } = searchParams;
  const size = meta?.size ?? 0;

  const currentPage = Math.floor(offset / limit) + 1;
  const maxPage = Math.ceil(size / limit);
  const maxOffset = Math.max((maxPage - 1) * limit, 0);

  const setLimit = (limit: number) => setSearchParams({ limit });
  const setOffset = (offset: number) => setSearchParams({ offset });

  // Remove offset when list size changes
  useEffect(() => {
    if (offset >= maxOffset) {
      setSearchParams({ offset: maxOffset });
    }
  }, [offset, setSearchParams, maxOffset]);

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
