import { TokensOverlap } from 'components/common/tokensOverlap';
import { Token } from 'libs/tokens';

interface Props {
  baseToken: Token;
  quoteToken: Token;
  strategyType: string;
}

export const SimulatorSummaryTokens = ({
  baseToken,
  quoteToken,
  strategyType,
}: Props) => {
  return (
    <article className="flex flex-shrink-0 items-center">
      <TokensOverlap className="h-40 w-40" tokens={[baseToken!, quoteToken!]} />
      <div className="mx-15 flex flex-col">
        <h2 className="flex gap-6 text-18">
          {baseToken.symbol}
          <span className="self-align-center text-secondary !text-16">/</span>
          {quoteToken.symbol}
        </h2>
        <h3 className="flex items-center gap-8 font-mono text-12 text-white/60">
          {strategyType}
        </h3>
      </div>
    </article>
  );
};