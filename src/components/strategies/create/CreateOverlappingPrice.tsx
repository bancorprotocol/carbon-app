import { FC, useEffect } from 'react';
import {
  isMaxBelowMarket,
  isMinAboveMarket,
} from 'components/strategies/overlapping/utils';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { OverlappingSpread } from 'components/strategies/overlapping/OverlappingSpread';
import { OverlappingAnchor } from 'components/strategies/overlapping/OverlappingAnchor';
import { Token } from 'libs/tokens';
import { useSearch } from '@tanstack/react-router';
import { CreateOverlappingOrder } from 'components/strategies/common/types';
import { isValidRange } from '../utils';
import { SetOverlapping } from 'libs/routing/routes/trade';
import { OverlappingPriceRange } from '../overlapping/OverlappingPriceRange';

interface Props {
  base: Token;
  quote: Token;
  buy: CreateOverlappingOrder;
  sell: CreateOverlappingOrder;
  spread: string;
  set: SetOverlapping;
}

const url = '/trade/overlapping';
export const CreateOverlappingPrice: FC<Props> = (props) => {
  const { base, quote, buy, sell, spread, set } = props;
  const search = useSearch({ from: url });
  const { anchor } = search;

  const aboveMarket = isMinAboveMarket(buy);
  const belowMarket = isMaxBelowMarket(sell);

  // WARNING
  const priceWarning = (() => {
    if (!aboveMarket && !belowMarket) return;
    return 'Notice: your strategy is “out of the money” and will be traded when the market price moves into your price range.';
  })();

  useEffect(() => {
    if (!isValidRange(buy.min, sell.max)) return;
    if (anchor === 'buy' && aboveMarket) {
      set({ anchor: 'sell', budget: undefined });
    }
    if (anchor === 'sell' && belowMarket) {
      set({ anchor: 'buy', budget: undefined });
    }
  }, [anchor, aboveMarket, belowMarket, set, buy.min, sell.max]);

  const setMin = (min: string) => set({ min });
  const setMax = (max: string) => set({ max });
  const setSpread = (spread: string) => set({ spread });

  const setAnchorValue = (value: 'buy' | 'sell') => {
    set({ anchor: value, budget: undefined });
  };

  if (!base || !quote) return null;

  return (
    <>
      <article key="price-range" className="grid gap-16 p-16">
        <header className="flex items-center gap-8">
          <h3 className="text-16 font-medium flex-1">
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
        <OverlappingPriceRange
          base={base}
          quote={quote}
          min={buy.min}
          max={sell.max}
          setMin={setMin}
          setMax={setMax}
          minLabel="Min Buy Price"
          maxLabel="Max Sell Price"
          warnings={[priceWarning]}
          isOverlapping
          required
        />
      </article>
      <OverlappingSpread
        buyMin={Number(buy.min)}
        sellMax={Number(sell.max)}
        spread={spread}
        setSpread={setSpread}
      />
      <article className="grid gap-16 p-16">
        <hgroup>
          <h3 className="text-16 font-medium flex items-center justify-between">
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
    </>
  );
};
