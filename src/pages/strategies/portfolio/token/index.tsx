import { useMatch } from 'libs/routing';

export const StrategiesPortfolioTokenPage = () => {
  const {
    params: { address },
  } = useMatch();

  return <div>PortfolioToken: {address}</div>;
};
