import { useWagmi } from 'libs/wagmi';
import { ConnectedLandingPage } from './connected';
import { UnconnectedLandingPage } from './unconnected';

export const LandingPage = () => {
  const { user } = useWagmi();
  if (user) {
    return <ConnectedLandingPage />;
  } else {
    return <UnconnectedLandingPage />;
  }
};
