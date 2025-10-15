import { TokensOverlap } from 'components/common/tokensOverlap';
import { useEditStrategyCtx } from './EditStrategyContext';
import { PairName } from 'components/common/DisplayPair';

export const EditStrategyOverlapTokens = () => {
  const { strategy } = useEditStrategyCtx();
  return (
    <header className="surface flex items-center gap-16 rounded-s-full rounded-e-8 px-16 py-8">
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
