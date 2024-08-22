import { ActivityLayout } from 'components/activity/ActivityLayout';
import { ActivityProvider } from 'components/activity/ActivityProvider';
import { useWagmi } from 'libs/wagmi';

export const StrategiesActivityPage = () => {
  const { user } = useWagmi();
  const params = { ownerId: user };
  return (
    <ActivityProvider params={params}>
      <ActivityLayout filters={['ids', 'pairs']} />
    </ActivityProvider>
  );
};
