import { StrategyInputValues } from 'hooks/useStrategyInput';
import { Link } from 'libs/routing';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { SimulatorType } from 'libs/routing/routes/sim';
import { SimulatorSummaryGains } from './SimulatorSummaryGains';
import { SimulatorSummaryRoi } from './SimulatorSummaryRoi';
import { SimulatorSummaryTokens } from './SimulatorTokens';
import { SimulatorSummaryTable } from './SimulatorSummaryTable';
import { cn } from 'utils/helpers';

interface Props {
  roi?: number;
  gains?: number;
  state: StrategyInputValues;
  strategyType: SimulatorType;
  isLoading: boolean;
}

export const SimulatorSummary = ({
  roi = 0.0,
  gains = 0.0,
  state,
  strategyType,
  isLoading,
}: Props) => {
  const baseToken = state.baseToken!;
  const quoteToken = state.quoteToken!;

  return (
    <header className="my-8 grid gap-8 xl:grid-cols-2">
      <section
        className={cn(
          'flex h-72 items-center justify-between gap-8 rounded-10 bg-black px-16',
          {
            'animate-pulse': isLoading,
          }
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
              buy={state.buy}
              sell={state.sell}
              baseToken={baseToken}
              quoteToken={quoteToken}
            />
          </>
        )}
      </section>
      <section
        className={cn(
          'grid h-72 grid-cols-4 items-center gap-8 rounded-10 bg-black px-16',
          {
            'animate-pulse': isLoading,
          }
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
              className={cn(
                buttonStyles({ variant: 'success', size: 'md' }),
                'whitespace-nowrap'
              )}
            >
              Create strategy
            </Link>
          </>
        )}
      </section>
    </header>
  );
};
