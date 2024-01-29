import { max, min, scaleBand } from 'd3';
import { StrategyInputDispatch } from 'hooks/useStrategyInput';
import { D3ChartHandleLine } from 'libs/d3/charts/candlestick/D3ChartHandleLine';
import { DragablePriceRange } from 'libs/d3/charts/candlestick/DragablePriceRange';
import { XAxis } from 'libs/d3/charts/candlestick/xAxis';
import { D3YAxiRight } from 'libs/d3/primitives/D3YAxisRight';
import { useLinearScale } from 'libs/d3/useLinearScale';
import { SimulatorInputSearch } from 'libs/routing/routes/sim';
import { useCallback, useMemo } from 'react';
import { prettifyNumber } from 'utils/helpers';
import { Candlesticks } from './Candlesticks';
import { CandlestickData, D3ChartSettings } from 'libs/d3';

interface Props {
  dms: D3ChartSettings;
  data: CandlestickData[];
  dispatch: StrategyInputDispatch;
  state: SimulatorInputSearch;
  marketPrice?: number;
}

export const D3ChartCandlesticks = (props: Props) => {
  const { dms, data, dispatch, state, marketPrice } = props;

  const xScale = useMemo(
    () =>
      scaleBand()
        .domain(data.map((d) => d.date.toString()))
        .range([0, dms.boundedWidth])
        .paddingInner(0.5),
    [data, dms.boundedWidth]
  );

  const y = useLinearScale({
    domain: [
      min(data, (d) => d.low) as number,
      max(data, (d) => d.high) as number,
    ],
    range: [dms.boundedHeight, 0],
  });

  const handleDrag = useCallback(
    (key: keyof SimulatorInputSearch, value: number) => {
      const inverted = y.scale.invert(value).toString();
      dispatch(key, inverted);
    },
    [dispatch, y.scale]
  );

  return (
    <>
      <Candlesticks xScale={xScale} yScale={y.scale} data={data} />
      <D3YAxiRight ticks={y.ticks} dms={dms} />
      <XAxis xScale={xScale} dms={dms} />

      {marketPrice && (
        <D3ChartHandleLine
          dms={dms}
          color="white"
          y={y.scale(marketPrice)}
          lineProps={{ strokeDasharray: 2 }}
          label={prettifyNumber(marketPrice, { currentCurrency: 'USD' })}
        />
      )}

      <DragablePriceRange
        type="buy"
        yScale={y.scale}
        onDrag={handleDrag}
        state={state}
        dms={dms}
      />
      <DragablePriceRange
        type="sell"
        yScale={y.scale}
        onDrag={handleDrag}
        state={state}
        dms={dms}
      />
    </>
  );
};
