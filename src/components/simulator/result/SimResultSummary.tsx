import { StrategyInputValues } from 'hooks/useStrategyInput';
import { Link } from 'libs/routing';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { SimulatorType } from 'libs/routing/routes/sim';
import { SimResultSummaryGains } from 'components/simulator/result/SimResultSummaryGains';
import { SimResultSummaryRoi } from 'components/simulator/result/SimResultSummaryRoi';
import { SimResultSummaryTokens } from 'components/simulator/result/SimResultSummaryTokens';
import { SimResultSummaryTable } from 'components/simulator/result/SimResultSummaryTable';
import { cn } from 'utils/helpers';

interface Props {
  roi?: number;
  gains?: number;
  state: StrategyInputValues;
  strategyType: SimulatorType;
  isPending: boolean;
}

export const SimResultSummary = ({
  roi = 0.0,
  gains = 0.0,
  state,
  strategyType,
  isPending,
}: Props) => {
  return (
    <header className="my-8 grid gap-8 xl:grid-cols-2">
      <section
        className={cn(
          'rounded-10 flex min-h-[72px] items-center justify-between gap-8 bg-black px-16 py-10',
          {
            'animate-pulse': isPending,
          },
        )}
      >
        {!isPending && !!state.baseToken && !!state.quoteToken && (
          <>
            <SimResultSummaryTokens
              baseToken={state.baseToken}
              quoteToken={state.quoteToken}
              strategyType={strategyType}
            />
            <SimResultSummaryTable
              buy={state.buy}
              sell={state.sell}
              baseToken={state.baseToken}
              quoteToken={state.quoteToken}
            />
          </>
        )}
      </section>
      <section
        className={cn(
          'rounded-10 grid min-h-[72px] grid-cols-4 items-center gap-8 bg-black px-16 py-10',
          {
            'animate-pulse': isPending,
          },
        )}
      >
        {!isPending && !!state.baseToken && !!state.quoteToken && (
          <>
            <SimResultSummaryGains
              portfolioGains={gains}
              quoteToken={state.quoteToken}
            />
            <SimResultSummaryRoi portfolioRoi={roi} />
            {strategyType === 'recurring' ? (
              <Link
                to="/trade/recurring"
                search={{
                  base: state.baseToken.address,
                  quote: state.quoteToken.address,
                  buyMin: state.buy.min,
                  buyMax: state.buy.max,
                  buyBudget: state.buy.budget,
                  buySettings:
                    state.buy.min === state.buy.max ? 'limit' : 'range',
                  sellMin: state.sell.min,
                  sellMax: state.sell.max,
                  sellBudget: state.sell.budget,
                  sellSettings:
                    state.sell.min === state.sell.max ? 'limit' : 'range',
                }}
                className={cn(
                  buttonStyles({ variant: 'success', size: 'md' }),
                  'whitespace-nowrap',
                )}
              >
                Create
              </Link>
            ) : (
              <Link
                to="/trade/overlapping"
                search={{
                  base: state.baseToken.address,
                  quote: state.quoteToken.address,
                  min: state.buy.min,
                  max: state.sell.max,
                  spread: state.overlappingSpread,
                  anchor: 'buy',
                  budget: state.buy.budget,
                }}
                className={cn(
                  buttonStyles({ variant: 'success', size: 'md' }),
                  'whitespace-nowrap',
                )}
              >
                Create
              </Link>
            )}
          </>
        )}
      </section>
    </header>
  );
};
