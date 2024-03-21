import { Activity, QueryActivityParams } from 'libs/queries/extApi/activity';
import { ActivitySearchParams, activitySchema, filterActivity } from './utils';
import { ListOptions, ListProvider, useList } from 'hooks/useList';
import { FC, ReactNode } from 'react';
import { useActivityQuery } from './useActivityQuery';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { NotFound } from 'components/common/NotFound';

interface Props {
  params: QueryActivityParams;
  children: ReactNode;
}
export const ActivityProvider: FC<Props> = ({ children, params }) => {
  const query = useActivityQuery(params);
  const listOptions: ListOptions<Activity, ActivitySearchParams> = {
    all: query.data ?? [],
    defaultLimit: 10,
    schema: activitySchema,
    filter: filterActivity,
  };

  if (query.isLoading) {
    return (
      <CarbonLogoLoading className="h-[100px] self-center justify-self-center" />
    );
  }
  const activities = query.data ?? [];
  if (!activities.length) {
    return (
      <NotFound
        variant="error"
        title="We couldn't find any activities"
        text=""
        bordered
      />
    );
  }

  return <ListProvider {...listOptions}>{children}</ListProvider>;
};

export const useActivity = () => useList<Activity, ActivitySearchParams>();
