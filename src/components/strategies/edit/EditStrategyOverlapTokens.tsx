import { TokensOverlap } from 'components/common/tokensOverlap';
import { useEditStrategyCtx } from './EditStrategyContext';
import { PairName } from 'components/common/DisplayPair';

export const EditStrategyOverlapTokens = () => {
  const { strategy } = useEditStrategyCtx();
  return (
    <header className="rounded-10 bg-background-900 flex w-full items-center space-x-10 p-20">
      <TokensOverlap tokens={[strategy.base, strategy.quote]} size={32} />
      <div>
        <h2 className="text-14">
          <PairName baseToken={strategy.base} quoteToken={strategy.quote} />
        </h2>
        <div className="text-14 flex text-white/60">
          ID: {strategy.idDisplay}
        </div>
      </div>
    </header>
  );
};
