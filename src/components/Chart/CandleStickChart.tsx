import { Dispatch, FC, SetStateAction, useEffect } from 'react';
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

type SetBoundaryLines = Dispatch<SetStateAction<BoundaryLine[]>>;

interface Props {
  data: CandleStickData[];
  boundaryLines: BoundaryLine[];
  setBoundaryLines: SetBoundaryLines;
}

const yExtent = fc
  .extentLinear()
  .accessors([(d: CandleStickData) => d.high, (d: CandleStickData) => d.low]);

const xExtent = fc.extentTime().accessors([(d: CandleStickData) => d.date]);

const gridlines = fc.annotationSvgGridline();

const boundaryLinesAnnotation = fc
  .annotationSvgLine()
  .value((d: BoundaryLine) => d.value);

const boundaryBandAnnotation = fc
  .annotationSvgBand()
  .fromValue((d: any) => d.low)
  .toValue((d: any) => d.high);

boundaryBandAnnotation.decorate((selection: any) => {
  selection
    .enter()
    .select('g path.band')
    .attr('class', 'opacity-20 fill-error-500');
});

const candlestickSeries = fc.seriesSvgCandlestick();

const multi = fc
  .seriesSvgMulti()
  .series([
    gridlines,
    candlestickSeries,
    boundaryLinesAnnotation,
    boundaryBandAnnotation,
  ])
  .mapping((props: Props, index: number, series: unknown[]) => {
    switch (series[index]) {
      case candlestickSeries:
        return props.data;
      case boundaryLinesAnnotation:
        return props.boundaryLines;
      case boundaryBandAnnotation:
        return [
          {
            low: props.boundaryLines[0].value,
            high: props.boundaryLines[1].value,
          },
        ];
    }
  });

const chart = fc
  .chartCartesian(d3.scaleTime(), d3.scaleLinear())
  .yNice()
  .svgPlotArea(multi);

const onDragBoundary = ({ data, boundaryLines, setBoundaryLines }: Props) =>
  d3.drag().on('drag', ({ subject, sourceEvent }) => {
    setBoundaryLines(() => {
      const index = boundaryLines.findIndex((d) => d.value === subject.value);
      const boundaries = [...boundaryLines];
      boundaries.splice(index, 1);
      return boundaries;
    });
    const yValue = 412 - sourceEvent.offsetY;
    const value = d3.scaleLinear(yExtent(data), [0, 412]).invert(yValue);
    setBoundaryLines((prev: BoundaryLine[]) => [
      ...prev,
      {
        ...subject,
        value,
      },
    ]);
  });

const decorateBoundaryLines = (props: Props) => {
  boundaryLinesAnnotation.decorate((selection: any) => {
    selection
      .enter()
      .select('g.left-handle')
      .append('text')
      .attr('x', 5)
      .attr('y', -5);

    selection
      .select('g.left-handle text')
      .text((d: BoundaryLine) => d.name + ' - ' + d.value.toFixed(2))
      .call(onDragBoundary(props));
  });
};

export const CandleStickChart: FC<Props> = (props) => {
  chart.xDomain(xExtent(props.data));
  chart.yDomain(yExtent(props.data));

  decorateBoundaryLines(props);

  useEffect(() => {
    d3.select('#chart').datum(props).call(chart);
  }, [props]);

  return <div id="chart" className={'h-[500px]'}></div>;
};
