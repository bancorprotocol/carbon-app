import { PortfolioAllTokensPieChartCenter } from 'components/strategies/portfolio/allTokens/PortfolioAllTokensPieChartCenter';
import { AnyStrategyWithFiat } from 'components/strategies/common/types';
import { GetPortfolioTokenHref } from 'components/strategies/portfolio/types';
import { memo } from 'react';
import { PortfolioAllTokensDesktop } from './PortfolioAllTokensDesktop';
import { PortfolioAllTokensMobile } from './PortfolioAllTokensMobile';
import { usePortfolioAllTokensPieChart } from 'components/strategies/portfolio/allTokens/usePortfolioAllTokensPieChart';
import { PortfolioLayout } from './../PortfolioLayout';
import { PortfolioPieChart } from './../PortfolioPieChart';
import { usePortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { StrategyCreateFirst } from 'components/strategies/overview/StrategyCreateFirst';

interface Props {
  strategies?: AnyStrategyWithFiat[];
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
    if (!isExplorer) return <StrategyCreateFirst />;
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
