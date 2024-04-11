import { PortfolioToken } from 'components/strategies/portfolio';
import { useStrategyCtx } from 'hooks/useStrategies';
import { useParams } from 'libs/routing';

export const StrategiesPortfolioTokenPage = () => {
  const { strategies, isLoading } = useStrategyCtx();
  const { address } = useParams({
    from: '/my-strategy-layout/strategies/portfolio/token/$address',
  });

  return (
    <PortfolioToken
      strategies={strategies}
      isLoading={isLoading}
      address={address}
      backLinkHref="/strategies/portfolio"
    />
  );
};
