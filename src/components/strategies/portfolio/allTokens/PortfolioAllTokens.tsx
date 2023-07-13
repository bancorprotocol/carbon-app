import { PortfolioAllTokensDesktop } from './PortfolioAllTokensDesktop';
import { PortfolioAllTokensMobile } from './PortfolioAllTokensMobile';
import { usePortfolioAllTokens } from './usePortfolioAllTokens';
import { PortfolioLayout } from './../PortfolioLayout';
import { PortfolioPieChart } from './../PortfolioPieChart';
import { usePortfolio } from 'components/strategies/portfolio/usePortfolio';

export const PortfolioAllTokens = () => {
  const { tableData, totalValue, isLoading } = usePortfolio();
  const { pieChartOptions } = usePortfolioAllTokens(tableData);

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
          centerElement={totalValue.toFixed(2)}
          isLoading={isLoading}
        />
      }
    />
  );
};
