import {
  useStrategyPortfolio,
  PortfolioAllTokens,
} from 'components/strategies/portfolio';
import { usePortfolioAllTokens } from 'components/strategies/portfolio/allTokens/usePortfolioAllTokens';
import { PortfolioLayout } from 'components/strategies/portfolio/PortfolioLayout';
import { PortfolioPieChart } from 'components/strategies/portfolio/token/PortfolioTokenPieChart';

export const StrategiesPortfolioPage = () => {
  const { tableData, totalValue, isLoading } = useStrategyPortfolio();
  const { pieChartOptions } = usePortfolioAllTokens(tableData);

  return (
    <PortfolioLayout
      isLoading={isLoading}
      tableElement={<PortfolioAllTokens data={tableData} />}
      pieChartElement={
        <PortfolioPieChart
          options={pieChartOptions}
          centerElement={totalValue.toFixed(2)}
        />
      }
    />
  );
};
