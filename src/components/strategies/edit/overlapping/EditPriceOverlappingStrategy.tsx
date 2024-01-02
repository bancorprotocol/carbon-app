import { FC, useEffect, useState } from 'react';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { Strategy } from 'libs/queries';
import {
  getMaxBuyMin,
  getMinSellMax,
  getRoundedSpreadPPM,
  isMaxBelowMarket,
  isMinAboveMarket,
} from 'components/strategies/overlapping/utils';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { useMarketIndication } from 'components/strategies/marketPriceIndication';
import { carbonSDK } from 'libs/sdk';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import { OverlappingStrategyGraph } from 'components/strategies/overlapping/OverlappingStrategyGraph';
import { OverlappingStrategySpread } from 'components/strategies/overlapping/OverlappingStrategySpread';
import { OverlappingRange } from 'components/strategies/overlapping/OverlappingRange';
import { EditOverlappingStrategyBudget } from './EditOverlappingStrategyBudget';

interface Props {
  strategy: Strategy;
  order0: OrderCreate;
  order1: OrderCreate;
  setOverlappingError: (error: string) => void;
}

export const EditPriceOverlappingStrategy: FC<Props> = (props) => {
  const { strategy, order0, order1 } = props;
  const { base, quote } = strategy;
  const min = order0.min;
  const max = order1.max;
  const marketPrice = useMarketPrice({ base, quote });
  const { marketPricePercentage } = useMarketIndication({
    base,
    quote,
    order: { min, max, price: '', isRange: true },
  });

  const [spreadPPM, setSpreadPPM] = useState(getRoundedSpreadPPM(strategy));
  const [anchoredOrder, setAnchoderOrder] = useState<'buy' | 'sell'>('buy');
  const [mounted, setMounted] = useState(false);

  const setOverlappingParams = async (min: string, max: string) => {
    const params = await carbonSDK.calculateOverlappingStrategyPrices(
      quote!.address,
      min,
      max,
      marketPrice.toString(),
      spreadPPM.toString()
    );
    order0.setMin(min);
    order0.setMax(params.buyPriceHigh);
    order0.setMarginalPrice(params.buyPriceMarginal);
    order1.setMin(params.sellPriceLow);
    order1.setMax(max);
    order1.setMarginalPrice(params.sellPriceMarginal);
    return params;
  };

  const setBuyBudget = async (
    sellBudget: string,
    buyMin: string,
    sellMax: string
  ) => {
    if (!base || !quote) return;
    if (!sellBudget) return order0.setBudget('');
    const buyBudget = await carbonSDK.calculateOverlappingStrategyBuyBudget(
      base.address,
      quote.address,
      buyMin,
      sellMax,
      marketPrice.toString(),
      spreadPPM.toString(),
      sellBudget
    );
    order0.setBudget(buyBudget);
  };

  const setSellBudget = async (
    buyBudget: string,
    buyMin: string,
    sellMax: string
  ) => {
    if (!base || !quote) return;
    if (!buyBudget) order1.setBudget('');
    const sellBudget = await carbonSDK.calculateOverlappingStrategySellBudget(
      base.address,
      quote.address,
      buyMin,
      sellMax,
      marketPrice.toString(),
      spreadPPM.toString(),
      buyBudget
    );
    order1.setBudget(sellBudget);
  };

  // Initialize order when market price is available
  useEffect(() => {
    if (!quote || !base || marketPrice <= 0) return;
    if (!mounted) return setMounted(true);
    if (order0.min && order1.max) setOverlappingParams(order0.min, order1.max);
    if (anchoredOrder === 'buy') setSellBudget(order0.budget, min, max);
    if (anchoredOrder === 'sell') setBuyBudget(order1.budget, min, max);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketPrice, spreadPPM]);

  // Update on buyMin changes
  useEffect(() => {
    const min = order0.min;
    const max = order1.max;
    if (!min) return;
    if (!mounted) return setMounted(true);
    if (max) {
      setOverlappingParams(min, max).then((params) => {
        const marginalPrice = params.buyPriceMarginal;
        if (isMinAboveMarket({ min, marginalPrice }, quote)) {
          setAnchoderOrder('sell');
          setBuyBudget(order1.budget, min, max);
        } else {
          if (anchoredOrder === 'buy') setSellBudget(order0.budget, min, max);
          if (anchoredOrder === 'sell') setBuyBudget(order1.budget, min, max);
        }
      });
    }
    const timeout = setTimeout(async () => {
      const decimals = quote?.decimals ?? 18;
      const minSellMax = getMinSellMax(Number(min), spreadPPM);
      if (Number(max) < minSellMax) order1.setMax(minSellMax.toFixed(decimals));
    }, 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order0.min]);

  // Update on sellMax changes
  useEffect(() => {
    const min = order0.min;
    const max = order1.max;
    if (!max) return;
    if (!mounted) return setMounted(true);
    if (min) {
      setOverlappingParams(min, max).then((params) => {
        const marginalPrice = params.sellPriceMarginal;
        if (isMaxBelowMarket({ max, marginalPrice }, quote)) {
          setAnchoderOrder('buy');
          setSellBudget(order0.budget, min, max);
        } else {
          if (anchoredOrder === 'buy') setSellBudget(order0.budget, min, max);
          if (anchoredOrder === 'sell') setBuyBudget(order1.budget, min, max);
        }
      });
    }
    const timeout = setTimeout(async () => {
      const decimals = quote?.decimals ?? 18;
      const maxBuyMin = getMaxBuyMin(Number(max), spreadPPM);
      if (Number(min) > maxBuyMin) order0.setMin(maxBuyMin.toFixed(decimals));
    }, 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order1.max]);

  return (
    <>
      <article className="flex w-full flex-col gap-20 rounded-10 bg-silver p-20">
        <header>
          <h3 className="flex-1 text-18 font-weight-500">Price Range</h3>
        </header>
        <OverlappingStrategyGraph
          base={base}
          quote={quote}
          order0={order0}
          order1={order1}
          marketPrice={marketPrice}
          spreadPPM={spreadPPM}
          marketPricePercentage={marketPricePercentage}
          setOverlappingParams={setOverlappingParams}
        />
      </article>
      <article className="flex w-full flex-col gap-20 rounded-10 bg-silver p-20">
        <header className="flex items-center gap-8">
          <h3 className="flex-1 text-18 font-weight-500">
            Edit Price Range&nbsp;
            <span className="text-white/40">
              ({quote?.symbol} per 1 {base?.symbol})
            </span>
          </h3>
          <Tooltip element="Indicate the strategy exact buy and sell prices.">
            <IconTooltip className="h-14 w-14 text-white/60" />
          </Tooltip>
        </header>
        {base && quote && (
          <OverlappingRange
            base={base}
            quote={quote}
            order0={order0}
            order1={order1}
            marketPricePercentage={marketPricePercentage}
          />
        )}
      </article>
      <article className="flex w-full flex-col gap-10 rounded-10 bg-silver p-20">
        <header className="mb-10 flex items-center gap-8 ">
          <h3 className="flex-1 text-18 font-weight-500">Edit Spread</h3>
          <Tooltip element="The difference between the highest bidding (Sell) price, and the lowest asking (Buy) price">
            <IconTooltip className="h-14 w-14 text-white/60" />
          </Tooltip>
        </header>
        <OverlappingStrategySpread
          order0={order0}
          order1={order1}
          defaultValue={0.05}
          options={[0.01, 0.05, 0.1]}
          spreadPPM={spreadPPM}
          setSpreadPPM={setSpreadPPM}
        />
      </article>
      <EditOverlappingStrategyBudget
        {...props}
        marketPrice={marketPrice}
        anchoredOrder={anchoredOrder}
        setAnchoderOrder={setAnchoderOrder}
        setBuyBudget={setBuyBudget}
        setSellBudget={setSellBudget}
      />
    </>
  );
};
