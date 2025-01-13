import { PairName } from 'components/common/DisplayPair';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { StrategyBlockBudget } from 'components/strategies/overview/strategyBlock/StrategyBlockBudget';
import { StrategyBlockBuySell } from 'components/strategies/overview/strategyBlock/StrategyBlockBuySell';
import { StrategyGraph } from 'components/strategies/overview/strategyBlock/StrategyGraph';
import { ReactComponent as DeleteIcon } from 'assets/icons/delete.svg';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { CartStrategy } from 'libs/queries';
import { CSSProperties, FC } from 'react';
import { cn } from 'utils/helpers';
import { useCartDuplicate } from 'components/strategies/create/useDuplicateStrategy';
import { useModal } from 'hooks/useModal';
import {
  isZero,
  outSideMarketWarning,
} from 'components/strategies/common/utils';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { useMarketPrice } from 'hooks/useMarketPrice';

interface Props {
  strategy: CartStrategy;
  className?: string;
  style?: CSSProperties;
}

const getWarning = (strategy: CartStrategy, marketPrice?: number) => {
  const { base, order0, order1 } = strategy;
  const buyOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: order0.startRate,
    max: order0.endRate,
    buy: true,
  });
  if (buyOutsideMarket) return buyOutsideMarket;
  const sellOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: order1.startRate,
    max: order1.endRate,
    buy: false,
  });
  if (sellOutsideMarket) return sellOutsideMarket;
};
const getError = (strategy: CartStrategy) => {
  if (!isZero(strategy.order0.balance)) return '';
  if (!isZero(strategy.order1.balance)) return '';
  return 'Please note that your strategy will be inactive as it will not have any budget.';
};

export const CartStrategyItems: FC<Props> = (props) => {
  const { strategy, style, className } = props;
  const { base, quote } = strategy;
  const { openModal } = useModal();
  const duplicate = useCartDuplicate();
  const { marketPrice } = useMarketPrice({ base, quote });

  const warningMsg = getWarning(strategy, marketPrice);
  const errorMsg = getError(strategy);

  const remove = async () => {
    openModal('confirmDeleteCartStrategy', { strategy });
  };

  return (
    <li
      id={strategy.id}
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
            aria-label="Delete strategy"
            onClick={remove}
          >
            <DeleteIcon className="size-16" />
          </button>
          <button
            type="button"
            className="size-38 rounded-6 border-background-800 grid place-items-center border-2 hover:bg-white/10 active:bg-white/20"
            aria-label="Edit strategy"
            onClick={() => duplicate(strategy)}
          >
            <EditIcon className="size-16" />
          </button>
        </div>
      </header>
      <div className="relative">
        <StrategyBlockBudget strategy={strategy} />
        {!errorMsg && warningMsg && (
          <div className="rounded-8 border-warning absolute inset-0 grid place-items-center border-2 bg-black/60 p-8 backdrop-blur-sm">
            <Warning message={warningMsg} />
          </div>
        )}
        {errorMsg && (
          <div className="rounded-8 border-error absolute inset-0 grid place-items-center border-2 bg-black/60 p-8 backdrop-blur-sm">
            <Warning message={errorMsg} isError />
          </div>
        )}
      </div>
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