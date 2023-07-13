import { PortfolioTokenHeader } from 'components/strategies/portfolio/token/PortfolioTokenHeader';
import { PortfolioTokenPieChartCenter } from 'components/strategies/portfolio/token/PortfolioTokenPieChartCenter';
import { usePortfolioToken } from 'components/strategies/portfolio/token/usePortfolioToken';
import { PortfolioLayout } from './../PortfolioLayout';
import { PortfolioPieChart } from './../PortfolioPieChart';
import { PortfolioTokenDesktop } from './PortfolioTokenDesktop';
import { PortfolioTokenMobile } from './PortfolioTokenMobile';
import { usePortfolioTokenPieChart } from './usePortfolioTokenPieChart';
import { PathNames, useMatch } from 'libs/routing';

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
      headerElement={
        <PortfolioTokenHeader
          backLinkHref={PathNames.portfolio}
          symbol={selectedToken?.token.symbol}
          logoURI={selectedToken?.token.logoURI}
        />
      }
      desktopView={
        <PortfolioTokenDesktop data={tableData} isLoading={isLoading} />
      }
      mobileView={
        <PortfolioTokenMobile data={tableData} isLoading={isLoading} />
      }
      pieChartElement={
        <PortfolioPieChart
          options={pieChartOptions}
          centerElement={<PortfolioTokenPieChartCenter data={selectedToken} />}
          isLoading={isLoading}
        />
      }
    />
  );
};
