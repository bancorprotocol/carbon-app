import { Link } from 'libs/routing';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { SimulatorSummaryGains } from './SimulatorSummaryGains';
import { SimulatorSummaryRoi } from './SimulatorSummaryRoi';
import { SimulatorSummaryTokens } from './SimulatorTokens';
import { SimulatorSummaryTable } from './SimulatorSummaryTable';
import { StrategyInput2 } from 'hooks/useStrategyInput';
import { cn } from 'utils/helpers';

interface Props {
  roi?: number;
  gains?: number;
  state2: StrategyInput2;
  isLoading: boolean;
}

export const SimulatorSummary = ({
  roi = 0.0,
  gains = 0.0,
  state2,
  isLoading,
}: Props) => {
  const baseToken = state2.baseToken!;
  const quoteToken = state2.quoteToken!;

  const strategyType = state2.simulationType;

  return (
    <header className="my-8 flex flex-wrap gap-8">
      <section
        className={cn(
          'flex h-72 flex-1 flex-grow flex-wrap items-center justify-evenly gap-8 rounded-10 bg-black px-16 md:justify-between',
          { 'animate-pulse': isLoading }
        )}
      >
        {!isLoading && (
          <>
            <SimulatorSummaryTokens
              baseToken={baseToken}
              quoteToken={quoteToken}
              strategyType={strategyType}
            />
            <SimulatorSummaryTable
              buy={state2.buy}
              sell={state2.sell}
              baseToken={baseToken}
              quoteToken={quoteToken}
            />
          </>
        )}
      </section>
      <section
        className={cn(
          'flex h-72 flex-1 flex-grow flex-wrap items-center justify-evenly gap-8 rounded-10 bg-black px-16 md:justify-between',
          { 'animate-pulse': isLoading }
        )}
      >
        {!isLoading && (
          <>
            <SimulatorSummaryGains
              portfolioGains={gains}
              quoteToken={quoteToken}
            />
            <SimulatorSummaryRoi portfolioRoi={roi} />
            <Link
              to="/strategies/create"
              search={{
                base: baseToken?.address,
                quote: quoteToken?.address,
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
