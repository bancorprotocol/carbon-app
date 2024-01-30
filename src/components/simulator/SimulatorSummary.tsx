import { Link } from 'libs/routing';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { SimulatorSummaryGains } from './SimulatorSummaryGains';
import { SimulatorSummaryRoi } from './SimulatorSummaryRoi';
import { SimulatorSummaryTokens } from './SimulatorTokens';
import { SimulatorSummaryTable } from './SimulatorSummaryTable';
import { StrategyInput2 } from 'hooks/useStrategyInput';

interface Props {
  roi?: number;
  gains?: number;
  state2: StrategyInput2;
}

export const SimulatorSummary = ({ roi = 0.0, gains = 0.0, state2 }: Props) => {
  const baseToken = state2.baseToken!;
  const quoteToken = state2.quoteToken!;

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
          buy={state2.buy}
          sell={state2.sell}
          baseToken={baseToken}
          quoteToken={quoteToken}
        />
      </section>
      <section className="flex flex-grow flex-wrap items-center justify-evenly gap-8 rounded-10 bg-black p-16 md:justify-between">
        <SimulatorSummaryGains portfolioGains={gains} quoteToken={quoteToken} />
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
      </section>
    </header>
  );
};
