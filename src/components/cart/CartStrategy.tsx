import { PairName } from 'components/common/DisplayPair';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { StrategyBlockBudget } from 'components/strategies/overview/strategyBlock/StrategyBlockBudget';
import { StrategyBlockBuySell } from 'components/strategies/overview/strategyBlock/StrategyBlockBuySell';
import { StrategyGraph } from 'components/strategies/overview/strategyBlock/StrategyGraph';
import { ReactComponent as DeleteIcon } from 'assets/icons/delete.svg';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { CartStrategy } from 'libs/queries';
import { CSSProperties, FC, useId } from 'react';
import { cn } from 'utils/helpers';
import { useDuplicate } from 'components/strategies/create/useDuplicateStrategy';

interface Props {
  onRemove: () => void;
  strategy: CartStrategy;
  className?: string;
  style?: CSSProperties;
}

export const CartStrategyItems: FC<Props> = (props) => {
  const { strategy, style, className, onRemove } = props;
  const { base, quote } = strategy;
  const duplicate = useDuplicate();
  const id = useId();

  const remove = async () => {
    const keyframes = { opacity: 0, transform: 'scale(0.9)' };
    const option = {
      duration: 200,
      easing: 'cubic-bezier(.55, 0, 1, .45)',
      fill: 'forwards' as const,
    };
    await document.getElementById(id)?.animate(keyframes, option).finished;
    onRemove();
  };

  return (
    <li
      id={id}
      style={style}
      className={cn(
        'rounded-10 bg-background-900 grid grid-cols-1 grid-rows-[auto_auto_auto] gap-16 p-24',
        className
      )}
    >
      <header className="flex items-center gap-16">
        <TokensOverlap size={40} tokens={[base, quote]} />
        <h3 className="text-18 flex gap-6" data-testid="token-pair">
          <PairName baseToken={base} quoteToken={quote} />
        </h3>
        <div role="menubar" className="ml-auto flex gap-8">
          <button
            role="menuitem"
            type="button"
            className="size-38 rounded-6 border-background-800 grid place-items-center border-2 hover:bg-white/10 active:bg-white/20"
            onClick={remove}
          >
            <DeleteIcon className="size-16" />
          </button>
          <button
            aria-label="Edit strategy"
            onClick={() => duplicate(strategy)}
            className="size-38 rounded-6 border-background-800 grid place-items-center border-2 hover:bg-white/10 active:bg-white/20"
          >
            <EditIcon className="size-16" />
          </button>
        </div>
      </header>
      <StrategyBlockBudget strategy={strategy} />
      <div className="rounded-8 border-background-800 grid grid-cols-2 grid-rows-[auto_auto] border-2">
        <StrategyBlockBuySell
          strategy={strategy}
          buy
          className="border-background-800 border-r-2"
        />
        <StrategyBlockBuySell strategy={strategy} />
        <div className="border-background-800 col-start-1 col-end-3 border-t-2">
          <StrategyGraph strategy={strategy} />
        </div>
      </div>
    </li>
  );
};
