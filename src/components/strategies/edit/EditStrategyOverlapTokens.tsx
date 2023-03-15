import { TokensOverlap } from 'components/common/tokensOverlap';
import { Strategy } from 'libs/queries';

type EditStrategyOverlapTokensProps = {
  strategy: Strategy;
};

export const EditStrategyOverlapTokens = ({
  strategy,
}: EditStrategyOverlapTokensProps) => {
  const paddedID = strategy.id.padStart(9, '0');

  return (
    <div
      className={
        'bg-secondary flex w-full items-center space-x-10 rounded-10 p-15 pl-30 font-mono'
      }
    >
      <TokensOverlap
        className="h-32 w-32"
        tokens={[strategy.token0, strategy.token1]}
      />
      <div>
        {
          <div className="flex gap-6">
            <span>{strategy.token0.symbol}</span>
            <div className="text-secondary !text-16">/</div>
            <span>{strategy.token1.symbol}</span>
          </div>
        }
        <div className="text-secondary flex gap-8">
          <span>{paddedID.slice(0, 3)}</span>
          <span>{paddedID.slice(3, 6)}</span>
          <span>{paddedID.slice(6, 9)}</span>
        </div>
      </div>
    </div>
  );
};
