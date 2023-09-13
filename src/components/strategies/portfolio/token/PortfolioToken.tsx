import { PortfolioTokenHeader } from 'components/strategies/portfolio/token/PortfolioTokenHeader';
import { PortfolioTokenPieChartCenter } from 'components/strategies/portfolio/token/PortfolioTokenPieChartCenter';
import { usePortfolioToken } from 'components/strategies/portfolio/token/usePortfolioToken';
import { Strategy } from 'libs/queries';
import { memo } from 'react';
import { PortfolioLayout } from './../PortfolioLayout';
import { PortfolioPieChart } from './../PortfolioPieChart';
import { PortfolioTokenDesktop } from './PortfolioTokenDesktop';
import { PortfolioTokenMobile } from './PortfolioTokenMobile';
import { usePortfolioTokenPieChart } from './usePortfolioTokenPieChart';

interface Props {
  address: string;
  strategies?: Strategy[];
  isLoading?: boolean;
  backLinkHref: string;
}

const _PortfolioToken = ({
  strategies,
  isLoading: _isLoading,
  address,
  backLinkHref,
}: Props) => {
  const { tableData, isLoading, selectedToken } = usePortfolioToken({
    address,
    strategies,
    isLoading: _isLoading,
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
          backLinkHref={backLinkHref}
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

export const PortfolioToken = memo(
  _PortfolioToken,
  (prev, next) =>
    prev.isLoading === next.isLoading &&
    JSON.stringify(prev.strategies) === JSON.stringify(next.strategies)
);
