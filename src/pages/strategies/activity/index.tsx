import { ActivityProvider } from 'components/activity/ActivityProvider';
import { ActivitySection } from 'components/activity/ActivitySection';
import { StrategyCreateFirst } from 'components/strategies/overview/StrategyCreateFirst';
import { useWeb3 } from 'libs/web3';

export const StrategiesActivityPage = () => {
  const { user } = useWeb3();
  return (
    <ActivityProvider
      params={{ ownerId: user }}
      empty={<StrategyCreateFirst />}
    >
      <ActivitySection />
    </ActivityProvider>
  );
};
