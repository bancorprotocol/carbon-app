import { TokensOverlap } from 'components/common/tokensOverlap';
import { Strategy } from 'libs/queries';

type EditStrategyOverlapTokensProps = {
  strategy: Strategy;
};

export const EditStrategyOverlapTokens = ({
  strategy,
}: EditStrategyOverlapTokensProps) => {
  return (
    <header className="rounded-10 bg-background-900 flex w-full items-center space-x-10 p-20">
      <TokensOverlap tokens={[strategy.base, strategy.quote]} size={32} />
      <div>
        <h2 className="text-14 flex gap-6">
          <span>{strategy.base.symbol}</span>
          <span role="separator" className="text-white/60">
            /
          </span>
          <span>{strategy.quote.symbol}</span>
        </h2>
        <div className="text-14 flex text-white/60">
          ID: {strategy.idDisplay}
        </div>
      </div>
    </header>
  );
};
