import { Activity, QueryActivityParams } from 'libs/queries/extApi/activity';
import { ActivitySearchParams, activitySchema, filterActivity } from './utils';
import { ListOptions, ListProvider, useList } from 'hooks/useList';
import { FC, ReactNode } from 'react';
import { useActivityQuery } from './useActivityQuery';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { NotFound } from 'components/common/NotFound';
import { useGetUserStrategies } from 'libs/queries';

interface Props {
  params: QueryActivityParams;
  empty?: ReactNode;
  children: ReactNode;
}
export const ActivityProvider: FC<Props> = ({ children, params, empty }) => {
  const activityQuery = useActivityQuery(params);
  const listOptions: ListOptions<Activity, ActivitySearchParams> = {
    all: activityQuery.data ?? [],
    status: activityQuery.fetchStatus,
    defaultLimit: 10,
    schema: activitySchema,
    filter: filterActivity,
  };
  const userStrategiesQuery = useGetUserStrategies({
    user: params.ownerId,
  });

  if (activityQuery.isPending || userStrategiesQuery.isPending) {
    return <CarbonLogoLoading className="w-[100px] flex-1 self-center" />;
  }
  const activities = activityQuery.data ?? [];
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

  return <ListProvider {...listOptions}>{children}</ListProvider>;
};

export const useActivity = () => useList<Activity, ActivitySearchParams>();
