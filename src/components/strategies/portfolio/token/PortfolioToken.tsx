import { Imager } from 'components/common/imager/Imager';
import { usePortfolioToken } from 'components/strategies/portfolio/token/usePortfolioToken';
import { cn, prettifyNumber } from 'utils/helpers';
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
          centerElement={
            <div
              className={cn('flex', 'flex-col', 'items-center', 'space-y-6')}
            >
              <div
                className={cn(
                  'flex',
                  'items-center',
                  'font-weight-500',
                  'text-18'
                )}
              >
                <Imager
                  alt={'Token Logo'}
                  src={selectedToken?.token.logoURI}
                  className={'h-24 w-24 me-10'}
                />
                {selectedToken?.token.symbol}
              </div>
              <div className={cn('text-24', 'font-weight-500')}>
                ${prettifyNumber(selectedToken?.value || 0)} ???
              </div>
              <div className={cn('text-white/60', 'font-weight-500')}>
                {selectedToken?.strategies.length} Strategies
              </div>
            </div>
          }
          isLoading={isLoading}
        />
      }
    />
  );
};
