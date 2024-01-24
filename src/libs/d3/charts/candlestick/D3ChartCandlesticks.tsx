import { max, min, scaleBand, scaleLinear } from 'd3';
import { StrategyInputDispatch } from 'hooks/useStrategyInput';
import { DragablePriceRange } from 'libs/d3/charts/candlestick/DragablePriceRange';
import { XAxis } from 'libs/d3/charts/candlestick/xAxis';
import { YAxis } from 'libs/d3/charts/candlestick/yAxis';
import { SimulatorInputSearch } from 'libs/routing/routes/sim';
import { useCallback } from 'react';
import { Candlesticks } from './Candlesticks';
import { CandlestickData, D3ChartSettings } from 'libs/d3';

interface Props {
  dms: D3ChartSettings;
  data: CandlestickData[];
  dispatch: StrategyInputDispatch;
  state: SimulatorInputSearch;
}

export const D3ChartCandlesticks = ({ dms, data, dispatch, state }: Props) => {
  const xScale = scaleBand()
    .domain(data.map((d) => d.date.toString()))
    .range([0, dms.boundedWidth])
    .paddingInner(0.2);

  const yScale = scaleLinear()
    .domain([
      min(data, (d) => d.low) as number,
      max(data, (d) => d.high) as number,
    ])
    .rangeRound([dms.boundedHeight, 0])
    .nice();

  const handleDrag = useCallback(
    (key: keyof SimulatorInputSearch, value: number) => {
      dispatch(key, yScale.invert(value).toString());
    },
    [dispatch, yScale]
  );

  return (
    <>
      <Candlesticks xScale={xScale} yScale={yScale} data={data} />
      <YAxis yScale={yScale} />
      <XAxis xScale={xScale} dms={dms} />
      <DragablePriceRange
        type="buy"
        yScale={yScale}
        onDrag={handleDrag}
        state={state}
        dms={dms}
      />
      <DragablePriceRange
        type="sell"
        yScale={yScale}
        onDrag={handleDrag}
        state={state}
        dms={dms}
      />
    </>
  );
};
