import { Link } from 'libs/routing';
import { Token } from 'libs/tokens';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { SimulatorBounds, SimulatorReturn } from 'libs/queries';
import { SimulatorSummaryGains } from './SimulatorSummaryGains';
import { SimulatorSummaryRoi } from './SimulatorSummaryRoi';
import { SimulatorSummaryTokens } from './SimulatorTokens';
import { SimulatorSummaryRanges } from './SimulatorSummaryRanges';

interface Props extends Pick<SimulatorReturn, 'data'> {
  baseToken: Token;
  quoteToken: Token;
  bounds: SimulatorBounds;
}

export const SimulatorSummary = ({ baseToken, quoteToken, bounds }: Props) => {
  return (
    <header className="my-8 flex flex-wrap gap-8">
      <section className="flex flex-grow flex-wrap items-center justify-evenly gap-8 rounded-10 bg-black p-16 md:justify-between">
        <SimulatorSummaryTokens
          baseToken={baseToken}
          quoteToken={quoteToken}
          strategyType="Recurring"
        />
        <SimulatorSummaryRanges
          bounds={bounds}
          baseBudget={123}
          quoteBudget={344}
          baseToken={baseToken}
          quoteToken={quoteToken}
        />
      </section>
      <section className="flex flex-grow flex-wrap items-center justify-evenly gap-8 rounded-10 bg-black p-16 md:justify-between">
        <SimulatorSummaryGains />
        <SimulatorSummaryRoi />
        <Link
          to="/strategies/create"
          className={buttonStyles({ variant: 'success', size: 'md' })}
        >
          Create strategy
        </Link>
      </section>
    </header>
  );
};
