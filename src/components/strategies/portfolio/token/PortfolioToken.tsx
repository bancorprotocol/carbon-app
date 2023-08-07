import { UseQueryResult } from '@tanstack/react-query';
import { PortfolioTokenHeader } from 'components/strategies/portfolio/token/PortfolioTokenHeader';
import { PortfolioTokenPieChartCenter } from 'components/strategies/portfolio/token/PortfolioTokenPieChartCenter';
import { usePortfolioToken } from 'components/strategies/portfolio/token/usePortfolioToken';
import { Strategy } from 'libs/queries';
import { PortfolioLayout } from './../PortfolioLayout';
import { PortfolioPieChart } from './../PortfolioPieChart';
import { PortfolioTokenDesktop } from './PortfolioTokenDesktop';
import { PortfolioTokenMobile } from './PortfolioTokenMobile';
import { usePortfolioTokenPieChart } from './usePortfolioTokenPieChart';
import { PathNames } from 'libs/routing';

interface Props {
  address: string;
  strategiesQuery: UseQueryResult<Strategy[], unknown>;
}

export const PortfolioToken = ({ strategiesQuery, address }: Props) => {
  const { tableData, isLoading, selectedToken } = usePortfolioToken({
    address,
    strategiesQuery,
  });

  const { pieChartOptions } = usePortfolioTokenPieChart(
    tableData,
    // TODO fix undefined token
    selectedToken?.token!
  );

  if (!selectedToken && !isLoading) {
    return <div>error token not found</div>;
  }

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
        <PortfolioTokenDesktop
          data={tableData}
          isLoading={isLoading}
          // TODO selectedToken should not be undefined
          selectedToken={selectedToken?.token!}
        />
      }
      mobileView={
        <PortfolioTokenMobile
          data={tableData}
          isLoading={isLoading}
          // TODO selectedToken should not be undefined
          selectedToken={selectedToken?.token!}
        />
      }
      pieChartElement={
        <PortfolioPieChart
          options={pieChartOptions}
          centerElement={<PortfolioTokenPieChartCenter data={selectedToken} />}
          isLoading={isLoading}
          hideChart={selectedToken?.value.isZero()}
        />
      }
    />
  );
};
