import { StrategyPortfolioData } from 'components/strategies/portfolio/useStrategyPortfolio';
import { FC } from 'react';
import { PortfolioAllTokensMobileCard } from 'components/strategies/portfolio/allTokens/PortfolioAllTokensMobileCard';
import { cn } from 'utils/helpers';

type Props = {
  data: StrategyPortfolioData[];
};

export const PortfolioAllTokensMobile: FC<Props> = ({ data }) => {
  return (
    <div className={cn('space-y-20')}>
      {data.map((value, i) => (
        <PortfolioAllTokensMobileCard key={i} index={i} data={value} />
      ))}
    </div>
  );
};
