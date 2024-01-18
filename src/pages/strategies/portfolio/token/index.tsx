import { PortfolioToken } from 'components/strategies/portfolio';
import { useStrategyCtx } from 'hooks/useStrategies';
import { PathNames, useParams } from 'libs/routing';

export const StrategiesPortfolioTokenPage = () => {
  const { strategies, isLoading } = useStrategyCtx();
  const { address } = useParams({
    from: '/my-strategy-layout/strategies/portfolio/token/$address',
  });

  return (
    <PortfolioToken
      strategies={strategies}
      isLoading={isLoading}
      address={address as string}
      backLinkHref={PathNames.portfolio}
    />
  );
};
