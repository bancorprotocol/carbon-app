import { TokensOverlap } from 'components/common/tokensOverlap';
import { Token } from 'libs/tokens';

interface Props {
  baseToken: Token;
  quoteToken: Token;
  strategyType: 'recurring' | 'overlapping';
}

export const SimResultSummaryTokens = ({
  baseToken,
  quoteToken,
  strategyType,
}: Props) => {
  return (
    <article className="gap-15 flex flex-shrink-0 items-center">
      <TokensOverlap className="size-40" tokens={[baseToken!, quoteToken!]} />
      <div className="flex flex-col">
        <h2 className="text-18 flex gap-6">
          {baseToken.symbol}
          <span className="self-align-center text-secondary !text-16">/</span>
          {quoteToken.symbol}
        </h2>
        <h3 className="text-12 flex items-center gap-8 font-mono capitalize text-white/60">
          {strategyType}
        </h3>
      </div>
    </article>
  );
};
