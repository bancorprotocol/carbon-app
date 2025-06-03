import { PairName } from 'components/common/DisplayPair';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { StrategyBlockBudget } from 'components/strategies/overview/strategyBlock/StrategyBlockBudget';
import { StrategyBlockBuySell } from 'components/strategies/overview/strategyBlock/StrategyBlockBuySell';
import { StrategyGraph } from 'components/strategies/overview/strategyBlock/StrategyGraph';
import { ReactComponent as IconTrash } from 'assets/icons/trash.svg';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconClose } from 'assets/icons/X.svg';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { CartStrategy } from 'libs/queries';
import {
  CSSProperties,
  FC,
  ToggleEvent,
  useEffect,
  useId,
  useRef,
} from 'react';
import { cn } from 'utils/helpers';
import {
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
import styles from './CartStrategy.module.css';

interface Props {
  strategy: CartStrategy;
  className?: string;
  style?: CSSProperties;
}

const getWarnings = (strategy: CartStrategy, marketPrice?: number) => {
  const { base, order0, order1 } = strategy;
  const warnings: string[] = [];
  if (isZero(order0.balance) && isZero(order1.balance)) {
    warnings.push(
      'Please note that your strategy will be inactive as it will not have any budget.',
    );
  }
  if (isOverlappingStrategy(strategy)) {
    const aboveMarket = isMinAboveMarket(order0);
    const belowMarket = isMaxBelowMarket(order1);
    if (aboveMarket || belowMarket) {
      warnings.push(
        'Notice: your strategy is “out of the money” and will be traded when the market price moves into your price range.',
      );
    }
  } else {
    const buyOutsideMarket = outSideMarketWarning({
      base,
      marketPrice,
      min: order0.startRate,
      max: order0.endRate,
      buy: true,
    });
    if (buyOutsideMarket) warnings.push(buyOutsideMarket);
    const sellOutsideMarket = outSideMarketWarning({
      base,
      marketPrice,
      min: order1.startRate,
      max: order1.endRate,
      buy: false,
    });
    if (sellOutsideMarket) warnings.push(sellOutsideMarket);
  }
  return warnings;
};

export const CartStrategyItems: FC<Props> = (props) => {
  const { strategy, style, className } = props;
  const { base, quote } = strategy;
  const { marketPrice } = useMarketPrice({ base, quote });
  const { user } = useWagmi();
  const popoverId = useId();
  const close = useRef(() => document.getElementById(popoverId)?.hidePopover());

  const warnings = getWarnings(strategy, marketPrice);

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
    removeStrategyFromCart(user, strategy);
  };

  return (
    <li
      id={strategy.id}
      style={style}
      className={cn(
        'rounded-10 bg-background-900 grid grid-cols-1 grid-rows-[auto_auto_auto] gap-16 p-24',
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
              className="warning-message border-warning rounded-8 text-14 text-warning hover:bg-background-800 active:bg-background-700 flex items-center gap-8 border px-8 py-2 text-start"
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
            className="size-38 rounded-6 border-background-800 grid place-items-center border-2 hover:bg-white/10 active:bg-white/20"
            aria-label="Delete strategy"
            onClick={remove}
          >
            <IconTrash className="size-16" />
          </button>
        </div>
      </header>
      <div>
        <StrategyBlockBudget strategy={strategy} />
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
      {!!warnings.length && (
        <div
          id={popoverId}
          popover="auto"
          onBeforeToggle={setSize}
          className={cn(
            'rounded-8 bg-background-900 absolute m-0 overflow-hidden p-24',
            styles.warnings,
          )}
        >
          <article className="grid h-full content-start gap-16">
            <header className="flex items-center gap-16">
              <div className="bg-warning/25 text-warning rounded-full p-8">
                <IconWarning className="size-18" />
              </div>
              <h3 className="text-16 text-warning font-weight-700">Warnings</h3>
              <button
                type="button"
                popoverTarget={popoverId}
                popoverTargetAction="hide"
                aria-label="close warnings"
                className="hover:bg-background-900 ml-auto rounded-full p-8"
              >
                <IconClose className="size-16" />
              </button>
            </header>
            <ul className="text-14 grid list-disc gap-8 pl-16	text-white/80">
              {warnings.map((warning, i) => (
                <li key={i} style={{ ['--delay' as any]: `${(i + 1) * 50}ms` }}>
                  {warning}
                </li>
              ))}
            </ul>
          </article>
        </div>
      )}
    </li>
  );
};
