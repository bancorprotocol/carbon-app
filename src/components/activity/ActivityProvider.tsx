import { Activity, QueryActivityParams } from 'libs/queries/extApi/activity';
import { ActivitySearchParams, activitySchema, filterActivity } from './utils';
import { ListOptions, ListProvider, useList } from 'hooks/useList';
import { FC, ReactNode } from 'react';
import { useActivityQuery } from './useActivityQuery';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { NotFound } from 'components/common/NotFound';

interface Props {
  params: QueryActivityParams;
  empty?: ReactNode;
  children: ReactNode;
}
export const ActivityProvider: FC<Props> = ({ children, params, empty }) => {
  const query = useActivityQuery(params);
  const listOptions: ListOptions<Activity, ActivitySearchParams> = {
    all: query.data ?? [],
    defaultLimit: 10,
    schema: activitySchema,
    filter: filterActivity,
  };

  if (query.isLoading) {
    return <CarbonLogoLoading className="w-[100px] flex-1 self-center" />;
  }
  const activities = query.data ?? [];
  if (!activities.length) {
    if (empty) return empty;
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
