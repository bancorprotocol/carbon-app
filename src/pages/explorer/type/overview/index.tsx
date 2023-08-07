import { StrategyContent } from 'components/strategies/overview';
import { useGetUserStrategies } from 'libs/queries';
import { useMatch } from 'libs/routing';

export const ExplorerTypeOverviewPage = () => {
  const {
    params: { type, search },
  } = useMatch();

  const strategies = useGetUserStrategies({ user: search });

  switch (type) {
    case 'wallet': {
      return (
        <>
          <div>Explorer Wallet Overview Page</div>
          <div>user: {search}</div>
          <StrategyContent strategies={strategies} />
        </>
      );
    }
    case 'token-pair': {
      return (
        <>
          <div>Explorer Token Pair Overview Page</div>
          <div>token pair: {search}</div>
        </>
      );
    }
  }

  return <div>ups</div>;
};
