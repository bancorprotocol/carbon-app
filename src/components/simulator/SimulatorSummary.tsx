import { Link } from 'libs/routing';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { SimulatorSummaryGains } from './SimulatorSummaryGains';
import { SimulatorSummaryRoi } from './SimulatorSummaryRoi';
import { SimulatorSummaryTokens } from './SimulatorTokens';
import { SimulatorSummaryTable } from './SimulatorSummaryTable';
import { StrategyInput2 } from 'hooks/useStrategyInput';

interface Props {
  roi: number;
  gains: number;
  isLoading: boolean;
  state2: StrategyInput2;
}

export const SimulatorSummary = ({ roi, gains, isLoading, state2 }: Props) => {
  const baseToken = state2.baseToken!;
  const quoteToken = state2.quoteToken!;

  const portfolioGains = isLoading ? 0.0 : gains;
  const portfolioRoi = isLoading ? 0.0 : roi;

  const summaryData = {
    buyMin: state2.buy.min,
    buyMax: state2.buy.max,
    sellMin: state2.sell.min,
    sellMax: state2.sell.max,
    sellBudget: state2.sell.budget,
    buyBudget: state2.buy.budget,
  };

  const strategyType = state2.simulationType;

  return (
    <header className="my-8 flex flex-wrap gap-8">
      <section className="flex flex-grow flex-wrap items-center justify-evenly gap-8 rounded-10 bg-black p-16 md:justify-between">
        <SimulatorSummaryTokens
          baseToken={baseToken}
          quoteToken={quoteToken}
          strategyType={strategyType}
        />
        <SimulatorSummaryTable
          summaryData={summaryData}
          baseToken={baseToken}
          quoteToken={quoteToken}
        />
      </section>
      <section className="flex flex-grow flex-wrap items-center justify-evenly gap-8 rounded-10 bg-black p-16 md:justify-between">
        <SimulatorSummaryGains
          portfolioGains={portfolioGains}
          quoteToken={quoteToken}
        />
        <SimulatorSummaryRoi portfolioRoi={portfolioRoi} />
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
      </section>
    </header>
  );
};
