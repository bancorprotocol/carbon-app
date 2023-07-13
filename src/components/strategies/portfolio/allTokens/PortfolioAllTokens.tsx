import { cn, prettifyNumber } from 'utils/helpers';
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
            <div
              className={cn('flex', 'flex-col', 'items-center', 'space-y-6')}
            >
              <div className={cn('text-24', 'font-weight-500')}>
                ${prettifyNumber(totalValue)} ???
              </div>
              <div className={cn('text-white/60', 'font-weight-500')}>
                {tableData.length} Assets
              </div>
            </div>
          }
          isLoading={isLoading}
        />
      }
    />
  );
};
