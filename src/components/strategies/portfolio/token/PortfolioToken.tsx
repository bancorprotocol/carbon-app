import { usePortfolioToken } from 'components/strategies/portfolio/token/usePortfolioToken';
import { PortfolioLayout } from './../PortfolioLayout';
import { PortfolioPieChart } from './../PortfolioPieChart';
import { PortfolioTokenDesktop } from './PortfolioTokenDesktop';
import { PortfolioTokenMobile } from './PortfolioTokenMobile';
import { usePortfolioTokenPieChart } from './usePortfolioTokenPieChart';
import { useMatch } from 'libs/routing';

export const PortfolioToken = () => {
  const {
    params: { address },
  } = useMatch();

  const { tableData, isLoading, selectedToken } = usePortfolioToken({
    address,
  });

  const { pieChartOptions } = usePortfolioTokenPieChart(tableData);

  return (
    <PortfolioLayout
      desktopView={
        <PortfolioTokenDesktop data={tableData} isLoading={isLoading} />
      }
      mobileView={
        <PortfolioTokenMobile data={tableData} isLoading={isLoading} />
      }
      pieChartElement={
        <PortfolioPieChart
          options={pieChartOptions}
          centerElement={`${selectedToken?.value.toString()} ${
            selectedToken?.token.symbol || null
          }`}
          isLoading={isLoading}
        />
      }
    />
  );
};
