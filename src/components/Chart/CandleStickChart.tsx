import { FC, useCallback, useEffect } from 'react';
import * as d3 from 'd3';
import * as fc from 'd3fc';

export interface CandleStickData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BoundaryLine {
  name: string;
  value: number;
}

interface Props {
  data: CandleStickData[];
  boundaryLines: BoundaryLine[];
}

const yExtent = fc
  .extentLinear()
  .accessors([(d: CandleStickData) => d.high, (d: CandleStickData) => d.low]);

const xExtent = fc.extentTime().accessors([(d: CandleStickData) => d.date]);

const gridlines = fc.annotationSvgGridline();

const boundaryLines = fc
  .annotationSvgLine()
  .value((d: BoundaryLine) => d.value);

const candlestick = fc.seriesSvgCandlestick();

const multi = fc
  .seriesSvgMulti()
  .series([gridlines, candlestick, boundaryLines])
  .mapping((props: Props, index: number, series: unknown[]) => {
    switch (series[index]) {
      case candlestick:
        return props.data;
      case boundaryLines:
        return props.boundaryLines;
    }
  });

const chart = fc
  .chartCartesian(d3.scaleTime(), d3.scaleLinear())
  .chartLabel('Price History')
  .yTicks(5)
  .yLabel('Price (USD)')
  .yNice()
  .svgPlotArea(multi);

export const CandleStickChart: FC<Props> = (props) => {
  chart.xDomain(xExtent(props.data));
  chart.yDomain(yExtent(props.data));

  boundaryLines.decorate((selection: any) => {
    selection
      .enter()
      .select('g.left-handle')
      .append('text')
      .attr('x', 5)
      .attr('y', -5);

    selection
      .select('g.left-handle text')
      .text((d: BoundaryLine) => d.name + ' - ' + d.value.toFixed(2));
  });

  const render = useCallback(() => {
    d3.select('#chart').datum(props).call(chart);
  }, [props]);

  useEffect(() => {
    render();
  }, [render]);

  return <div id="chart" className={'h-[500px]'}></div>;
};
