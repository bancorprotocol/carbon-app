import { ActivityProvider } from 'components/activity/ActivityProvider';
import { ActivitySection } from 'components/activity/ActivitySection';
import { useActivity } from 'components/activity/useActivity';
import { useWeb3 } from 'libs/web3';

export const StrategiesActivityPage = () => {
  const { user } = useWeb3();
  const query = useActivity({ ownerId: user });

  if (query.isLoading) return 'Loading';

  if (!query.data?.length) return 'No activities found';

  return (
    <ActivityProvider activities={query.data}>
      <ActivitySection />
    </ActivityProvider>
  );
};
