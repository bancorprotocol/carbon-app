import { Pathnames, PathParams } from 'libs/routing';
import { PortfolioTokenHeader } from 'components/strategies/portfolio/token/PortfolioTokenHeader';
import { PortfolioTokenPieChartCenter } from 'components/strategies/portfolio/token/PortfolioTokenPieChartCenter';
import { usePortfolioToken } from 'components/strategies/portfolio/token/usePortfolioToken';
import { AnyStrategyWithFiat } from 'components/strategies/common/types';
import { memo } from 'react';
import { PortfolioLayout } from './../PortfolioLayout';
import { PortfolioPieChart } from './../PortfolioPieChart';
import { PortfolioTokenDesktop } from './PortfolioTokenDesktop';
import { PortfolioTokenMobile } from './PortfolioTokenMobile';
import { usePortfolioTokenPieChart } from './usePortfolioTokenPieChart';
import { NotFound } from 'components/common/NotFound';

interface Props {
  address: string;
  strategies?: AnyStrategyWithFiat[];
  backLinkHref: Pathnames;
  backLinkHrefParams?: PathParams;
}

const LocalPortfolioToken = ({
  strategies,
  address,
  backLinkHref,
  backLinkHrefParams,
}: Props) => {
  const { tableData, isPending, selectedToken } = usePortfolioToken({
    address,
    strategies,
  });

  const { pieChartOptions } = usePortfolioTokenPieChart(
    tableData,
    selectedToken?.token,
  );

  if (!selectedToken && !isPending) {
    return (
      <NotFound
        variant="error"
        title="Token information not found"
        text="Please search the portfolio by a different token."
        className="grid-area-[list]"
      />
    );
  }

  return (
    <PortfolioLayout
      headerElement={
        <PortfolioTokenHeader
          backLinkHref={backLinkHref}
          backLinkHrefParams={backLinkHrefParams}
          symbol={selectedToken?.token.symbol}
          logoURI={selectedToken?.token.logoURI}
        />
      }
      desktopView={
        <PortfolioTokenDesktop
          data={tableData}
          isPending={isPending}
          selectedToken={selectedToken?.token}
        />
      }
      mobileView={
        <PortfolioTokenMobile
          data={tableData}
          isPending={isPending}
          selectedToken={selectedToken?.token}
        />
      }
      pieChartElement={
        <PortfolioPieChart
          options={pieChartOptions}
          centerElement={<PortfolioTokenPieChartCenter data={selectedToken} />}
          isPending={isPending}
          hideChart={selectedToken?.value.isZero()}
        />
      }
    />
  );
};

export const PortfolioToken = memo(
  LocalPortfolioToken,
  (prev, next) =>
    JSON.stringify(prev.strategies) === JSON.stringify(next.strategies),
);
