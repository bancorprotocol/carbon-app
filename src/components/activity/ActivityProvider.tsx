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

interface ActivityContextType {
  activities: Activity[];
  meta: ActivityMeta;
  searchParams: ActivitySearchParams;
  setSearchParams: (searchParams: Partial<ActivitySearchParams>) => any;
}

const ActivityContext = createContext<ActivityContextType>({
  activities: [],
  meta: { size: 0, pairs: [], actions: [], strategies: {} },
  searchParams: { limit: 10, offset: 0 },
  setSearchParams: () => {},
});

interface Props {
  params: QueryActivityParams;
  empty?: ReactNode;
  children: ReactNode;
}
type ParamsKey = Extract<keyof QueryActivityParams, string>;
export const ActivityProvider: FC<Props> = ({ children, params, empty }) => {
  const nav = useNavigate();

  const search: ActivitySearchParams = useSearch({ strict: false });
  params.limit ||= search.limit ?? 10;
  params.offset ||= search.offset ?? 0;
  if (search.actions) params.actions ||= search.actions;
  if (search.ids) params.strategyIds ||= search.ids?.join(',');
  if (search.pairs)
    params.pairs ||= search.pairs
      .map((pair) => `${pair[0]}_${pair[1]}`)
      .join(',');
  if (search.start) params.start ||= getUnixTime(new Date(search.start));
  if (search.end) params.end ||= getUnixTime(addDays(new Date(search.end), 1));

  for (const key in params) {
    if (isEmpty(params[key as ParamsKey])) delete params[key as ParamsKey];
  }

  const activityQuery = useActivityQuery(params);
  const activityMetaQuery = useActivityMetaQuery(params);

  const userStrategiesQuery = useGetUserStrategies({
    user: params.ownerId,
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

  const isPending =
    activityQuery.isPending ||
    activityMetaQuery.isPending ||
    userStrategiesQuery.isPending;

  if (isPending) {
    return <CarbonLogoLoading className="w-[100px] flex-1 self-center" />;
  }
  const activities = activityQuery.data ?? [];
  const meta = activityMetaQuery.data;

  if (!activities.length || !meta) {
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
    meta: meta,
    searchParams: search,
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
  const { size } = meta;

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
