import { TokensOverlap } from 'components/common/tokensOverlap';
import { Token } from 'libs/tokens';

interface Props {
  base: Token;
  quote: Token;
  strategyType: 'recurring' | 'overlapping';
}

const title = {
  recurring: 'Recurring',
  overlapping: 'Liquidity Position',
};

export const SimResultSummaryTokens = ({
  base,
  quote,
  strategyType,
}: Props) => {
  return (
    <article className="gap-15 flex flex-shrink-0 items-center">
      <TokensOverlap tokens={[base, quote]} size={30} />
      <div className="flex flex-col">
        <h2 className="text-18 flex gap-6">
          {base.symbol}
          <span className="self-align-center text-16 text-main-0/60">/</span>
          {quote.symbol}
        </h2>
        <h3 className="text-12 flex items-center gap-8 capitalize text-main-0/60">
          {title[strategyType]}
        </h3>
      </div>
    </article>
  );
};
