import { ActivityProvider } from 'components/activity/ActivityProvider';
import { ActivitySection } from 'components/activity/ActivitySection';
import { useActivity } from 'components/activity/useActivity';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { NotFound } from 'components/common/NotFound';
import { useWeb3 } from 'libs/web3';

export const StrategiesActivityPage = () => {
  const { user } = useWeb3();
  const query = useActivity({ ownerId: user });

  if (query.isLoading) {
    return (
      <CarbonLogoLoading className="m-80 h-[100px] self-center justify-self-center" />
    );
  }
  const activities = query.data ?? [];
  if (!activities.length) {
    return (
      <NotFound
        variant="error"
        title="Activities not found"
        text="You do not have any activities."
        bordered
      />
    );
  }
  return (
    <ActivityProvider activities={activities}>
      <ActivitySection />
    </ActivityProvider>
  );
};
