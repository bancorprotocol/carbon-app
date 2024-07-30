import { ActivityProvider } from 'components/activity/ActivityProvider';
import { ActivitySection } from 'components/activity/ActivitySection';
import { StrategyCreateFirst } from 'components/strategies/overview/StrategyCreateFirst';
import { useWagmi } from 'libs/wagmi';

export const StrategiesActivityPage = () => {
  const { user } = useWagmi();
  const params = { ownerId: user };
  return (
    <ActivityProvider params={params} empty={<StrategyCreateFirst />}>
      <ActivitySection filters={['ids', 'pairs']} />
    </ActivityProvider>
  );
};
