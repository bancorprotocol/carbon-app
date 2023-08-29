import { TokensOverlap } from 'components/common/tokensOverlap';
import { Strategy } from 'libs/queries';

type EditStrategyOverlapTokensProps = {
  strategy: Strategy;
};

export const EditStrategyOverlapTokens = ({
  strategy,
}: EditStrategyOverlapTokensProps) => {
  return (
    <div
      className={
        'bg-secondary flex w-full items-center rounded-10 p-15 font-mono ps-30 space-s-10'
      }
    >
      <TokensOverlap
        className="h-32 w-32"
        tokens={[strategy.base, strategy.quote]}
      />
      <div>
        {
          <div className="flex gap-6">
            <span>{strategy.base.symbol}</span>
            <div className="text-secondary !text-16">/</div>
            <span>{strategy.quote.symbol}</span>
          </div>
        }
        <div className="text-secondary flex">ID: {strategy.idDisplay}</div>
      </div>
    </div>
  );
};
