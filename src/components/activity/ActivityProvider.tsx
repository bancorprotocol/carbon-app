import { Activity } from 'libs/queries/extApi/activity';
import { ActivitySearchParams, activitySchema, filterActivity } from './utils';
import { ListOptions, ListProvider } from 'hooks/useList';
import { FC, ReactNode } from 'react';

interface Props {
  activities: Activity[];
  children: ReactNode;
}
export const ActivityProvider: FC<Props> = ({ activities, children }) => {
  const listOptions: ListOptions<Activity, ActivitySearchParams> = {
    all: activities,
    defaultLimit: 10,
    schema: activitySchema,
    filter: filterActivity,
  };

  return <ListProvider {...listOptions}>{children}</ListProvider>;
};
