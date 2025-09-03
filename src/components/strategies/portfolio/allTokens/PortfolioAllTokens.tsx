import { PortfolioAllTokensPieChartCenter } from 'components/strategies/portfolio/allTokens/PortfolioAllTokensPieChartCenter';
import { AnyStrategy } from 'components/strategies/common/types';
import { GetPortfolioTokenHref } from 'components/strategies/portfolio/types';
import { memo } from 'react';
import { PortfolioAllTokensDesktop } from './PortfolioAllTokensDesktop';
import { PortfolioAllTokensMobile } from './PortfolioAllTokensMobile';
import { usePortfolioAllTokensPieChart } from 'components/strategies/portfolio/allTokens/usePortfolioAllTokensPieChart';
import { PortfolioLayout } from './../PortfolioLayout';
import { PortfolioPieChart } from './../PortfolioPieChart';
import { usePortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { StrategyCreateFirst } from 'components/strategies/overview/StrategyCreateFirst';
import { NotFound } from 'components/common/NotFound';

interface Props {
  strategies?: AnyStrategy[];
  isExplorer?: boolean;
  onRowClick: (address: string) => void;
  getHref: GetPortfolioTokenHref;
}

const LocalPortfolioAllTokens = ({
  strategies,
  isExplorer,
  onRowClick,
  getHref,
}: Props) => {
  const { tableData, totalValue, isPending } = usePortfolioData({
    strategies,
  });
  const { pieChartOptions } = usePortfolioAllTokensPieChart(tableData);

  if (!isPending && tableData && tableData.length === 0) {
    if (isExplorer) {
      return (
        <NotFound
          variant="error"
          title="We couldn't find any strategies"
          text="Try entering a different wallet address or choose a different token pair or reset your filters."
          bordered
        />
      );
    }
    return <StrategyCreateFirst />;
  }

  return (
    <PortfolioLayout
      desktopView={
        <PortfolioAllTokensDesktop
          data={tableData}
          isPending={isPending}
          onRowClick={onRowClick}
        />
      }
      mobileView={
        <PortfolioAllTokensMobile
          data={tableData}
          isPending={isPending}
          getHref={getHref}
        />
      }
      pieChartElement={
        <PortfolioPieChart
          options={pieChartOptions}
          centerElement={
            <PortfolioAllTokensPieChartCenter
              totalValue={totalValue}
              assetsCount={tableData.length}
            />
          }
          isPending={isPending}
        />
      }
    />
  );
};

export const PortfolioAllTokens = memo(
  LocalPortfolioAllTokens,
  (prev, next) =>
    JSON.stringify(prev.strategies) === JSON.stringify(next.strategies),
);
