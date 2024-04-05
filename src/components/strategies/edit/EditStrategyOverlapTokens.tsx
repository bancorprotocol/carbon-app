import { TokensOverlap } from 'components/common/tokensOverlap';
import { Strategy } from 'libs/queries';

type EditStrategyOverlapTokensProps = {
  strategy: Strategy;
};

export const EditStrategyOverlapTokens = ({
  strategy,
}: EditStrategyOverlapTokensProps) => {
  return (
    <header className="flex w-full items-center space-x-10 rounded-10 bg-background-900 p-20">
      <TokensOverlap tokens={[strategy.base, strategy.quote]} size={32} />
      <div>
        <h2 className="flex gap-6 text-14">
          <span>{strategy.base.symbol}</span>
          <span role="separator" className="text-secondary">
            /
          </span>
          <span>{strategy.quote.symbol}</span>
        </h2>
        <div className="text-secondary flex">ID: {strategy.idDisplay}</div>
      </div>
    </header>
  );
};
