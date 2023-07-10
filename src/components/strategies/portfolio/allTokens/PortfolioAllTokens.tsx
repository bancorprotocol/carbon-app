import { FC } from 'react';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { PortfolioAllTokensMobile } from 'components/strategies/portfolio/allTokens/PortfolioAllTokensMobile';
import { PortfolioAllTokensDesktop } from 'components/strategies/portfolio/allTokens/PortfolioAllTokensDesktop';
import { StrategyPortfolioData } from 'components/strategies/portfolio/useStrategyPortfolio';

type Props = {
  data: StrategyPortfolioData[];
};

export const PortfolioAllTokens: FC<Props> = ({ data }) => {
  const { belowBreakpoint } = useBreakpoints();

  if (belowBreakpoint('lg')) {
    return <PortfolioAllTokensMobile data={data} />;
  }

  return <PortfolioAllTokensDesktop data={data} />;
};
