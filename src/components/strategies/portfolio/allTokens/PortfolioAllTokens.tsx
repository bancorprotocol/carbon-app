import { UseQueryResult } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { PortfolioAllTokensPieChartCenter } from 'components/strategies/portfolio/allTokens/PortfolioAllTokensPieChartCenter';
import { Strategy } from 'libs/queries';
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
interface Props {
  strategiesQuery: UseQueryResult<Strategy[], unknown>;
  onRowClick: (row: Row<PortfolioData>) => void;
  getHref: (row: PortfolioData) => string;
}

export const PortfolioAllTokens = ({
  strategiesQuery,
  onRowClick,
  getHref,
}: Props) => {
  const { tableData, totalValue, isLoading } = usePortfolioData({
    strategiesQuery,
  });
  const { pieChartOptions } = usePortfolioAllTokensPieChart(tableData);

  if (!isLoading && tableData && tableData.length === 0)
    return <StrategyCreateFirst />;

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
