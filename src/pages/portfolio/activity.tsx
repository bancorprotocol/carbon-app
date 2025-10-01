import { ActivityLayout } from 'components/activity/ActivityLayout';
import { ActivityProvider } from 'components/activity/ActivityProvider';
import { useWagmi } from 'libs/wagmi';

export const PortfolioActivityPage = () => {
  const { user } = useWagmi();
  const params = { ownerId: user };
  return (
    <ActivityProvider params={params} url="/portfolio/activity">
      <ActivityLayout filters={['ids', 'pairs']} />
    </ActivityProvider>
  );
};
