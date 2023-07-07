import {
  useStrategyPortfolio,
  PortfolioAllTokens,
} from 'components/strategies/portfolio';
import { PortfolioPieChart } from 'components/strategies/portfolio/allTokens/PortfolioPieChart';
import { cn } from 'utils/helpers';

export const StrategiesPortfolioPage = () => {
  const { tableData, totalValue, isLoading } = useStrategyPortfolio();

  return (
    <>
      {!isLoading && (
        <div className={cn('flex space-x-20')}>
          <div
            className={
              'relative h-[400px] w-[400px] flex-shrink-0 rounded-10 bg-silver'
            }
          >
            <div
              className={
                'absolute flex h-full w-full items-center justify-center'
              }
            >
              {totalValue.toString()}
            </div>
            <PortfolioPieChart data={tableData} />
          </div>
          <div className={cn('w-full')}>
            <PortfolioAllTokens data={tableData} />
          </div>
        </div>
      )}
    </>
  );
};
