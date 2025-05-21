import { PortfolioToken } from 'components/strategies/portfolio';
import { useStrategyCtx } from 'hooks/useStrategies';
import { useParams } from 'libs/routing';

export const StrategiesPortfolioTokenPage = () => {
  const { strategies, isPending } = useStrategyCtx();
  const { address } = useParams({
    from: '/portfolio/strategies/portfolio/token/$address',
  });

  return (
    <PortfolioToken
      strategies={strategies}
      isPending={isPending}
      address={address}
      backLinkHref="/portfolio/strategies/portfolio"
    />
  );
};
