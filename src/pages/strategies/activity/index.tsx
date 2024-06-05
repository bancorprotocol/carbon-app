import { ActivityProvider } from 'components/activity/ActivityProvider';
import { ActivitySection } from 'components/activity/ActivitySection';
import { StrategyCreateFirst } from 'components/strategies/overview/StrategyCreateFirst';
import { useWagmi } from 'libs/wagmi';

export const StrategiesActivityPage = () => {
  const { user } = useWagmi();
  return (
    <ActivityProvider
      params={{ ownerId: user }}
      empty={<StrategyCreateFirst />}
    >
      <ActivitySection filters={['ids', 'pairs']} />
    </ActivityProvider>
  );
};
