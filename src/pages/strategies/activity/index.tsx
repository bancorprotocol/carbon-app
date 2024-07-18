import { useSearch } from '@tanstack/react-router';
import { ActivityProvider } from 'components/activity/ActivityProvider';
import { ActivitySection } from 'components/activity/ActivitySection';
import { StrategyCreateFirst } from 'components/strategies/overview/StrategyCreateFirst';
import { useWagmi } from 'libs/wagmi';

export const StrategiesActivityPage = () => {
  const search = useSearch({ from: '/my-strategy-layout/strategies/activity' });
  const { user } = useWagmi();
  const params = {
    limit: search.limit ?? 10,
    offset: search.offset ?? 0,
    ownerId: user,
  };
  return (
    <ActivityProvider params={params} empty={<StrategyCreateFirst />}>
      <ActivitySection filters={['ids', 'pairs']} />
    </ActivityProvider>
  );
};
