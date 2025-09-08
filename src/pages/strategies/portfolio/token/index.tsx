import { PortfolioToken } from 'components/strategies/portfolio/token/PortfolioToken';
import { useStrategyCtx } from 'hooks/useStrategies';
import { useParams } from 'libs/routing';

export const StrategiesPortfolioTokenPage = () => {
  const strategies = useStrategyCtx();
  const { address } = useParams({
    from: '/portfolio/strategies/portfolio/token/$address',
  });

  return (
    <PortfolioToken
      strategies={strategies}
      address={address}
      backLinkHref="/portfolio/strategies/portfolio"
    />
  );
};
