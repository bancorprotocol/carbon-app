import { Row } from '@tanstack/react-table';
import { PortfolioAllTokensPieChartCenter } from 'components/strategies/portfolio/allTokens/PortfolioAllTokensPieChartCenter';
import { Strategy } from 'libs/queries';
import { GetPortfolioTokenHref } from 'components/strategies/portfolio/types';
import { memo } from 'react';
import { PortfolioAllTokensDesktop } from './PortfolioAllTokensDesktop';
import { PortfolioAllTokensMobile } from './PortfolioAllTokensMobile';
import { usePortfolioAllTokensPieChart } from 'components/strategies/portfolio/allTokens/usePortfolioAllTokensPieChart';
import { PortfolioLayout } from './../PortfolioLayout';
import { PortfolioPieChart } from './../PortfolioPieChart';
import {
  PortfolioData,
  usePortfolioData,
} from 'components/strategies/portfolio/usePortfolioData';
import { StrategyCreateFirst } from 'components/strategies/overview/StrategyCreateFirst';
import { NotFound } from 'components/common/NotFound';

interface Props {
  strategies?: Strategy[];
  isLoading?: boolean;
  isExplorer?: boolean;
  onRowClick: (row: Row<PortfolioData>) => void;
  getHref: GetPortfolioTokenHref;
}

const _PortfolioAllTokens = ({
  strategies,
  isLoading: _isLoading,
  isExplorer,
  onRowClick,
  getHref,
}: Props) => {
  const { tableData, totalValue, isLoading } = usePortfolioData({
    strategies,
    isLoading: _isLoading,
  });
  const { pieChartOptions } = usePortfolioAllTokensPieChart(tableData);

  if (!isLoading && tableData && tableData.length === 0) {
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
          isLoading={isLoading}
          onRowClick={onRowClick}
        />
      }
      mobileView={
        <PortfolioAllTokensMobile
          data={tableData}
          isLoading={isLoading}
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
          isLoading={isLoading}
        />
      }
    />
  );
};

export const PortfolioAllTokens = memo(
  _PortfolioAllTokens,
  (prev, next) =>
    prev.isLoading === next.isLoading &&
    JSON.stringify(prev.strategies) === JSON.stringify(next.strategies)
);
