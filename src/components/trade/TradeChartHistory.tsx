import {
  ChartPrices,
  D3ChartCandlesticks,
  OnPriceUpdates,
} from 'components/simulator/input/d3Chart';
import { D3ChartSettingsProps, D3ChartWrapper } from 'libs/d3';
import { useSearch } from '@tanstack/react-router';
import { useGetTokenPriceHistory } from 'libs/queries/extApi/tokenPrice';
import { TradeSearch } from 'libs/routing';
import { FC } from 'react';
import { BaseOrder } from 'components/strategies/common/types';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { useTradeCtx } from './TradeContext';
import { TradeTypes } from 'libs/routing/routes/trade';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { defaultEnd, defaultStart } from 'pages/simulator';

const chartSettings: D3ChartSettingsProps = {
  width: 0,
  height: 0,
  marginTop: 0,
  marginBottom: 40,
  marginLeft: 0,
  marginRight: 80,
};

interface Props {
  order0: BaseOrder;
  order1: BaseOrder;
  type: TradeTypes;
  isLimit?: { buy: boolean; sell: boolean };
  spread?: string;
  onPriceUpdates: OnPriceUpdates;
}

export const TradeChartHistory: FC<Props> = (props) => {
  const { type, order0, order1, isLimit, spread, onPriceUpdates } = props;
  const { base, quote } = useTradeCtx();
  const { priceStart, priceEnd } = useSearch({
    strict: false,
  }) as TradeSearch;
  const { marketPrice } = useMarketPrice({ base, quote });
  const prices: ChartPrices = {
    buy: {
      min: order0.min || '0',
      max: order0.max || '0',
    },
    sell: {
      min: order1.min || '0',
      max: order1.max || '0',
    },
  };
  const bounds: ChartPrices = {
    buy: { min: order0.min, max: order0.max },
    sell: { min: order1.min, max: order1.max },
  };

  const { data, isPending, isError } = useGetTokenPriceHistory({
    baseToken: base.address,
    quoteToken: quote.address,
    start: priceStart ?? defaultStart().toString(),
    end: priceEnd ?? defaultEnd().toString(),
  });

  if (isPending) return <CarbonLogoLoading className="h-[80px]" />;
  if (!data) return null;
  return (
    <D3ChartWrapper
      settings={chartSettings}
      className="rounded-12 flex-1 bg-black"
      data-testid="price-chart"
    >
      {(dms) => (
        <D3ChartCandlesticks
          dms={dms}
          prices={prices}
          onPriceUpdates={onPriceUpdates}
          data={data}
          marketPrice={marketPrice}
          bounds={bounds}
          onDragEnd={onPriceUpdates}
          isLimit={isLimit}
          type={type}
          overlappingSpread={spread}
        />
      )}
    </D3ChartWrapper>
  );
};
