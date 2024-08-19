import { FC, useCallback, useEffect } from 'react';
import {
  getMaxBuyMin,
  getMinSellMax,
  isMaxBelowMarket,
  isMinAboveMarket,
} from 'components/strategies/overlapping/utils';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { OverlappingSpread } from 'components/strategies/overlapping/OverlappingSpread';
import { OverlappingAnchor } from 'components/strategies/overlapping/OverlappingAnchor';
import { Token } from 'libs/tokens';
import { OverlappingMarketPriceProvider } from '../UserMarketPrice';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { InputRange } from '../common/InputRange';
import { OverlappingOrder } from 'components/strategies/common/types';
import { isZero } from '../common/utils';
import { isValidRange } from '../utils';
import { TradeOverlappingSearch } from 'libs/routing/routes/trade';

interface Props {
  base: Token;
  quote: Token;
  marketPrice: string;
  order0: OverlappingOrder;
  order1: OverlappingOrder;
  spread: string;
}
type Search = TradeOverlappingSearch;

const url = '/trade/overlapping';
export const CreateOverlappingPrice: FC<Props> = (props) => {
  const { base, quote, order0, order1, marketPrice, spread } = props;
  const navigate = useNavigate({ from: url });
  const search = useSearch({ strict: false }) as Search;
  const { anchor } = search;

  const set = useCallback(
    <T extends keyof Search>(key: T, value: Search[T]) => {
      navigate({
        search: (previous) => ({ ...previous, [key]: value }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate]
  );

  const aboveMarket = isMinAboveMarket(order0);
  const belowMarket = isMaxBelowMarket(order1);

  // WARNING
  const priceWarning = (() => {
    if (!aboveMarket && !belowMarket) return;
    return 'Notice: your strategy is “out of the money” and will be traded when the market price moves into your price range.';
  })();

  useEffect(() => {
    if (!isValidRange(order0.min, order1.max)) return;
    if (anchor === 'buy' && aboveMarket) {
      set('anchor', 'sell');
      set('budget', undefined);
    }
    if (anchor === 'sell' && belowMarket) {
      set('anchor', 'buy');
      set('budget', undefined);
    }
  }, [anchor, aboveMarket, belowMarket, set, order0.min, order1.max]);

  const setMin = (min: string) => set('min', min);

  const setMax = (max: string) => set('max', max);

  const setSpread = (value: string) => set('spread', value);

  const setAnchorValue = (value: 'buy' | 'sell') => {
    set('budget', undefined);
    set('anchor', value);
  };

  // Update on buyMin changes
  useEffect(() => {
    if (isZero(order0.min)) return;
    const timeout = setTimeout(async () => {
      const minSellMax = getMinSellMax(Number(order0.min), Number(spread));
      if (Number(order1.max) < minSellMax) set('max', minSellMax.toString());
    }, 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order0.min]);

  // Update on sellMax changes
  useEffect(() => {
    if (isZero(order1.max)) return;
    const timeout = setTimeout(async () => {
      const maxBuyMin = getMaxBuyMin(Number(order1.max), Number(spread));
      if (Number(order0.min) > maxBuyMin) set('min', maxBuyMin.toString());
    }, 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order1.max]);

  if (!base || !quote) return null;

  return (
    <OverlappingMarketPriceProvider marketPrice={+marketPrice}>
      <article
        key="price-range"
        className="bg-background-900 grid gap-16 rounded p-20"
      >
        <header className="flex items-center gap-8">
          <h3 className="text-16 font-weight-500 flex-1">
            Set Price Range&nbsp;
            <span className="text-white/40">
              ({quote?.symbol} per 1 {base?.symbol})
            </span>
          </h3>
          <Tooltip
            element="Indicate the strategy exact buy and sell prices."
            iconClassName="size-18 text-white/60"
          />
        </header>
        <InputRange
          base={base}
          quote={quote}
          min={order0.min}
          max={order1.max}
          setMin={setMin}
          setMax={setMax}
          minLabel="Min Buy Price"
          maxLabel="Max Sell Price"
          warnings={[priceWarning]}
          isOverlapping
          required
        />
      </article>
      <article className="bg-background-900 grid gap-16 rounded p-20">
        <header className="flex items-center gap-8 ">
          <h3 className="text-16 font-weight-500 flex-1">Set Fee Tier</h3>
          <Tooltip
            element="The difference between the highest bidding (Sell) price, and the lowest asking (Buy) price"
            iconClassName="size-18 text-white/60"
          />
        </header>
        <OverlappingSpread
          buyMin={Number(order0.min)}
          sellMax={Number(order1.max)}
          defaultValue={0.05}
          options={[0.01, 0.05, 0.1]}
          spread={spread}
          setSpread={setSpread}
        />
      </article>
      <article className="bg-background-900 grid gap-16 rounded p-20">
        <hgroup>
          <h3 className="text-16 font-weight-500 flex items-center justify-between">
            Budget
            <Tooltip
              iconClassName="size-18 text-white/60"
              element="Indicate the token, action and amount for the strategy. Note that in order to maintain the concentrated liquidity behavior, the 2nd budget indication will be calculated using the prices, fee tier and budget values you use."
            />
          </h3>
          <p className="text-14 text-white/80">
            Please select a token to proceed.
          </p>
        </hgroup>
        <OverlappingAnchor
          base={base}
          quote={quote}
          anchor={anchor}
          setAnchor={setAnchorValue}
          disableBuy={aboveMarket}
          disableSell={belowMarket}
        />
      </article>
    </OverlappingMarketPriceProvider>
  );
};
