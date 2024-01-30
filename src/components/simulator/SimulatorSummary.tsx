import { Link, useSearch } from 'libs/routing';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { cn } from 'utils/helpers';
import { SimulatorSummaryGains } from './SimulatorSummaryGains';
import { SimulatorSummaryRoi } from './SimulatorSummaryRoi';
import { SimulatorSummaryTokens } from './SimulatorTokens';
import { SimulatorSummaryTable } from './SimulatorSummaryTable';
import { useTokens } from 'hooks/useTokens';

interface Props {
  roi?: number;
  gains?: number;
  isLoading: boolean;
}

export const SimulatorSummary = ({
  roi = 0.0,
  gains = 0.0,
  isLoading,
}: Props) => {
  const search = useSearch({ from: '/simulator/result' });

  const { getTokenById } = useTokens();
  const baseToken = getTokenById(search.baseToken);
  const quoteToken = getTokenById(search.quoteToken);

  const summaryData = {
    buyMin: search.buyMin,
    buyMax: search.buyMax,
    sellMin: search.sellMin,
    sellMax: search.sellMax,
    sellBudget: search.sellBudget,
    buyBudget: search.buyBudget,
  };

  const strategyType = 'recurring';

  return (
    <header className="my-8 flex flex-wrap gap-8">
      <section
        className={cn(
          'flex flex-grow flex-wrap items-center justify-evenly gap-8 rounded-10 bg-black p-16 md:justify-between',
          { 'animate-pulse': isLoading, 'h-82': isLoading }
        )}
      >
        {!isLoading && (
          <>
            <SimulatorSummaryTokens
              baseToken={baseToken!}
              quoteToken={quoteToken!}
              strategyType={strategyType}
            />
            <SimulatorSummaryTable
              summaryData={summaryData}
              baseToken={baseToken!}
              quoteToken={quoteToken!}
            />
          </>
        )}
      </section>
      <section
        className={cn(
          'flex flex-grow flex-wrap items-center justify-evenly gap-8 rounded-10 bg-black p-16 md:justify-between',
          { 'animate-pulse': isLoading, 'h-82': isLoading }
        )}
      >
        {!isLoading && (
          <>
            <SimulatorSummaryGains
              portfolioGains={gains}
              quoteToken={quoteToken!}
            />
            <SimulatorSummaryRoi portfolioRoi={roi} />
            <Link
              to="/strategies/create"
              search={{
                base: baseToken!.address,
                quote: quoteToken!.address,
                strategyType:
                  strategyType === 'recurring' ? 'recurring' : undefined,
                strategySettings:
                  strategyType === 'recurring' ? 'range' : 'overlapping',
              }}
              className={buttonStyles({ variant: 'success', size: 'md' })}
            >
              Create strategy
            </Link>
          </>
        )}
      </section>
    </header>
  );
};
