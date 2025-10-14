import {
  CSSProperties,
  FC,
  ToggleEvent,
  useEffect,
  useId,
  useRef,
} from 'react';
import { PairName } from 'components/common/DisplayPair';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { StrategyBlockBudget } from 'components/strategies/overview/strategyBlock/StrategyBlockBudget';
import { StrategyBlockBuySell } from 'components/strategies/overview/strategyBlock/StrategyBlockBuySell';
import { StrategyGraph } from 'components/strategies/overview/strategyBlock/StrategyGraph';
import { ReactComponent as IconTrash } from 'assets/icons/trash.svg';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconClose } from 'assets/icons/X.svg';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { cn } from 'utils/helpers';
import {
  isEmptyGradientOrder,
  isGradientStrategy,
  isOverlappingStrategy,
  isZero,
  outSideMarketWarning,
} from 'components/strategies/common/utils';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { removeStrategyFromCart } from './utils';
import { useWagmi } from 'libs/wagmi';
import {
  isMaxBelowMarket,
  isMinAboveMarket,
} from 'components/strategies/overlapping/utils';
import { AnyCartStrategy } from 'components/strategies/common/types';
import {
  gradientDateError,
  gradientDateWarning,
  gradientPriceWarning,
} from 'components/strategies/common/gradient/utils';
import styles from './CartStrategy.module.css';
import { Warning } from 'components/common/WarningMessageWithIcon';

interface Props {
  strategy: AnyCartStrategy;
  className?: string;
  style?: CSSProperties;
}

const getWarnings = (strategy: AnyCartStrategy, marketPrice?: number) => {
  const warnings: string[] = [];
  if (isZero(strategy.buy.budget) && isZero(strategy.sell.budget)) {
    warnings.push(
      'Please note that your strategy will be inactive as it will not have any budget.',
    );
  }
  if (isGradientStrategy(strategy)) {
    const { buy, sell } = strategy;
    for (const order of [buy, sell]) {
      if (isEmptyGradientOrder(order)) continue;
      const direction = buy === order ? 'buy' : 'sell';
      const priceWarning = gradientPriceWarning(
        direction,
        order,
        strategy.base,
        marketPrice,
      );
      if (priceWarning) warnings.push(priceWarning);
      const dateWarning = gradientDateWarning(order);
      if (dateWarning) warnings.push(dateWarning);
    }
  } else {
    const { base, buy, sell } = strategy;
    if (isOverlappingStrategy(strategy)) {
      const aboveMarket = isMinAboveMarket(buy);
      const belowMarket = isMaxBelowMarket(sell);
      if (aboveMarket || belowMarket) {
        warnings.push(
          'Notice: your strategy is “out of the money” and will be traded when the market price moves into your price range.',
        );
      }
    } else {
      const buyOutsideMarket = outSideMarketWarning({
        base,
        marketPrice,
        min: buy.min,
        max: buy.max,
        isBuy: true,
      });
      if (buyOutsideMarket) warnings.push(buyOutsideMarket);
      const sellOutsideMarket = outSideMarketWarning({
        base,
        marketPrice,
        min: sell.min,
        max: sell.max,
        isBuy: false,
      });
      if (sellOutsideMarket) warnings.push(sellOutsideMarket);
    }
  }
  return warnings;
};

const getError = (strategy: AnyCartStrategy) => {
  if (isGradientStrategy(strategy)) {
    for (const order of [strategy.buy, strategy.sell]) {
      if (isEmptyGradientOrder(order)) return;
      const error = gradientDateError(order);
      if (error) return error;
    }
  }
};

export const CartStrategyItems: FC<Props> = (props) => {
  const { strategy, style, className } = props;
  const { base, quote } = strategy;
  const { marketPrice } = useMarketPrice({ base, quote });
  const { user } = useWagmi();
  const popoverId = useId();
  const close = useRef(() => document.getElementById(popoverId)?.hidePopover());

  const warnings = getWarnings(strategy, marketPrice);
  const error = getError(strategy);

  useEffect(() => {
    import('@oddbird/popover-polyfill/fn').then((res) => {
      if (res.isSupported()) return;
      res.apply();
    });
  }, []);

  const setSize = (event: ToggleEvent<HTMLDivElement>) => {
    if (!event.currentTarget.parentElement) return;
    if (event.newState === 'closed') {
      document.removeEventListener('scroll', close.current);
      window.removeEventListener('resize', close.current);
    } else {
      const el = event.currentTarget;
      const htmlRect = document.documentElement.getBoundingClientRect();
      const gutter = (window.innerWidth - htmlRect.width) / 2;
      const rect = event.currentTarget.parentElement.getBoundingClientRect();
      const scroll = window.scrollY;
      el.style.setProperty('top', `${rect.top + scroll}px`);
      el.style.setProperty('left', `${rect.left - gutter}px`);
      el.style.setProperty('width', `${rect.width}px`);
      el.style.setProperty('height', `${rect.height}px`);
      document.addEventListener('scroll', close.current, { once: true });
      window.addEventListener('resize', close.current, { once: true });
    }
  };

  const remove = async () => {
    if (!user) return;
    removeStrategyFromCart(user, strategy.id);
  };

  return (
    <li
      id={strategy.id}
      style={style}
      className={cn(
        'rounded-lg bg-white-gradient grid grid-cols-1 grid-rows-[auto_auto_auto] gap-16 p-24',
        className,
      )}
    >
      <header className="flex items-center gap-16">
        <TokensOverlap size={40} tokens={[base, quote]} />
        <div className="grid justify-items-start">
          <h3 className="text-18 flex gap-6" data-testid="token-pair">
            <PairName baseToken={base} quoteToken={quote} />
          </h3>
          {!!warnings.length && (
            <button
              type="button"
              popoverTarget={popoverId}
              className="warning-message border-warning rounded-md text-14 text-warning hover:bg-background-800 active:bg-background-700 flex items-center gap-8 border px-8 py-2 text-start"
            >
              <IconWarning className="size-14" />
              <span>Warnings</span>
              <IconChevron className="size-14" />
            </button>
          )}
        </div>
        <div role="menubar" className="ml-auto flex gap-8">
          <button
            role="menuitem"
            type="button"
            className="btn-secondary-gradient size-38 rounded-sm grid place-items-center p-0"
            aria-label="Withdraw & Delete"
            onClick={remove}
          >
            <IconTrash className="size-16" />
          </button>
        </div>
      </header>
      <div>
        <StrategyBlockBudget strategy={strategy} />
      </div>
      <div className="bg-black/20 rounded-md border-background-800 grid grid-cols-2 grid-rows-[auto_auto] border-2">
        <StrategyBlockBuySell
          strategy={strategy}
          isBuy
          className="border-background-800 border-r-2"
        />
        <StrategyBlockBuySell strategy={strategy} />
        <div className="border-background-800 col-start-1 col-end-3 border-t-2">
          <StrategyGraph strategy={strategy} />
        </div>
      </div>
      {!!warnings.length && (
        <div
          id={popoverId}
          popover="auto"
          onBeforeToggle={setSize}
          className={cn(
            'rounded-md bg-black absolute m-0 overflow-hidden p-24',
            styles.warnings,
          )}
        >
          <article className="grid h-full content-start gap-16">
            <header className="flex items-center gap-16">
              <div className="bg-warning/25 text-warning rounded-full p-8">
                <IconWarning className="size-18" />
              </div>
              <h3 className="text-16 text-warning font-bold">Warnings</h3>
              <button
                type="button"
                popoverTarget={popoverId}
                popoverTargetAction="hide"
                aria-label="close warnings"
                className="hover:bg-black ml-auto rounded-full p-8"
              >
                <IconClose className="size-16" />
              </button>
            </header>
            {error && (
              <div className="rounded-md border-error absolute inset-0 grid place-items-center border-2 bg-black/60 p-8 backdrop-blur-xs">
                <Warning message={error} isError />
              </div>
            )}
            {!error && !!warnings.length && (
              <ul className="text-14 grid list-disc gap-8 pl-16	text-white/80">
                {warnings.map((warning, i) => (
                  <li
                    key={i}
                    style={{ ['--delay' as any]: `${(i + 1) * 50}ms` }}
                  >
                    {warning}
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>
      )}
    </li>
  );
};
