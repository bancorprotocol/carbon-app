import { PortfolioToken } from 'components/strategies/portfolio';
import { useStrategyCtx } from 'hooks/useStrategies';
import { PathNames, useMatch } from 'libs/routing';

export const StrategiesPortfolioTokenPage = () => {
  const { strategies, isLoading } = useStrategyCtx();
  const {
    params: { address },
  } = useMatch({ strict: false });

  return (
    <PortfolioToken
      strategies={strategies}
      isLoading={isLoading}
      address={address}
      backLinkHref={PathNames.portfolio}
    />
  );
};
