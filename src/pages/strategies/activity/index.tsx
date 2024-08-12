import { ActivityProvider } from 'components/activity/ActivityProvider';
import { ActivitySection } from 'components/activity/ActivitySection';
import { useWagmi } from 'libs/wagmi';

export const StrategiesActivityPage = () => {
  const { user } = useWagmi();
  const params = { ownerId: user };
  return (
    <ActivityProvider params={params}>
      <ActivitySection filters={['ids', 'pairs']} />
    </ActivityProvider>
  );
};
