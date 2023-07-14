import { PortfolioAllTokensPieChartCenter } from 'components/strategies/portfolio/allTokens/PortfolioAllTokensPieChartCenter';
import { PortfolioAllTokensDesktop } from './PortfolioAllTokensDesktop';
import { PortfolioAllTokensMobile } from './PortfolioAllTokensMobile';
import { usePortfolioAllTokensPieChart } from 'components/strategies/portfolio/allTokens/usePortfolioAllTokensPieChart';
import { PortfolioLayout } from './../PortfolioLayout';
import { PortfolioPieChart } from './../PortfolioPieChart';
import { usePortfolioData } from 'components/strategies/portfolio/usePortfolioData';

export const PortfolioAllTokens = () => {
  const { tableData, totalValue, isLoading } = usePortfolioData();
  const { pieChartOptions } = usePortfolioAllTokensPieChart(tableData);

  return (
    <PortfolioLayout
      desktopView={
        <PortfolioAllTokensDesktop data={tableData} isLoading={isLoading} />
      }
      mobileView={
        <PortfolioAllTokensMobile data={tableData} isLoading={isLoading} />
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
