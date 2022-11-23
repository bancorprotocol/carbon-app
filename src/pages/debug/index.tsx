import { DebugImposter } from 'elements/debug/DebugImposter';
import { DebugTenderlyRPC } from 'elements/debug/DebugTenderlyRPC';
import { DebugWeb3 } from 'elements/debug/DebugWeb3';
import { Page } from 'components/Page';
import * as d3 from 'd3';
import * as fc from 'd3fc';
import { useCallback, useEffect, useState } from 'react';

// a random number generator
const generator = fc.randomGeometricBrownianMotion().steps(11);

// some formatters
const dateFormatter = d3.timeFormat('%b');
const valueFormatter = d3.format('$.0f');

const yExtent = fc
  .extentLinear()
  .include([0])
  .pad([0, 0.5])
  .accessors([(d: any) => d.sales]);

export const DebugPage = () => {
  const [data, setData] = useState({
    // target values for the annotations
    targets: [
      {
        name: 'low',
        value: 4.5,
      },
      {
        name: 'high',
        value: 7.2,
      },
    ],
    // randomly generated sales data
    sales: generator(1).map((d: any, i: any) => ({
      month: dateFormatter(new Date(0, i + 1, 0)),
      sales: d + i / 2,
    })),
  });

  const bar = fc
    .autoBandwidth(fc.seriesSvgBar())
    .crossValue((d: any) => d.month)
    .mainValue((d: any) => d.sales)
    .align('left');

  const chart = fc
    .chartCartesian(d3.scaleBand(), d3.scaleLinear())
    .chartLabel('Price History')
    .xDomain(data.sales.map((d: { month: number }) => d.month))
    .yDomain(yExtent(data.sales))
    .xPadding(0.2)
    .yTicks(5)
    .yTickFormat(valueFormatter)
    .yLabel('Price (USD)')
    .yNice();

  const annotation = fc.annotationSvgLine().value((d: any) => d.value);

  const multi = fc
    .seriesSvgMulti()
    .series([bar, annotation])
    .mapping((data: any, index: any, series: any) => {
      switch (series[index]) {
        case bar:
          return data.sales;
        case annotation:
          return data.targets;
      }
    });

  chart.svgPlotArea(multi);

  bar.decorate((selection: any) => {
    // The selection passed to decorate is the one which the component creates
    // within its internal data join, here we use the update selection to
    // apply a style to 'path' elements created by the bar series
    selection.select('.bar > path').style('fill', (d: any) => {
      const low = data.targets.reduce((prev, cur) =>
        prev.value < cur.value ? cur : prev
      );
      const high = data.targets.reduce((prev, cur) =>
        prev.value < cur.value ? prev : cur
      );
      return d.sales > low.value || d.sales < high.value ? 'inherit' : '#0c0';
    });
  });

  annotation.decorate((selection: any) => {
    selection
      .enter()
      .select('g.left-handle')
      .append('text')
      .attr('x', 5)
      .attr('y', -5);

    selection
      .select('g.left-handle text')
      .text((d: any) => d.name + ' - ' + valueFormatter(d.value) + 'M')
      .call(
        d3.drag().on('drag', (e) => {
          const sub = e.subject;
          setData((prev) => {
            const index = data.targets.findIndex((d) => d.value === sub.value);
            const targets = [...data.targets];
            targets.splice(index, 1);
            return { ...prev, targets };
          });
          const yValue = 412 - e.sourceEvent.offsetY;
          const tmp = d3
            .scaleLinear(yExtent(data.sales), [0, 412])
            .invert(yValue);
          setData((prev) => ({
            ...prev,
            targets: [
              ...prev.targets,
              {
                name: sub.name,
                value: tmp,
              },
            ],
          }));
          console.log(e);
          console.log('muh', sub);
        })
      );
  });

  const render = useCallback(() => {
    d3.select(`#chart`).datum(data).call(chart);
    d3.select('.svg-plot-areaaa').on('click', (e) => {
      const yValue = 412 - e.offsetY;
      const tmp = d3.scaleLinear(yExtent(data.sales), [0, 412]).invert(yValue);
      setData((prev) => ({
        ...prev,
        targets: [
          ...prev.targets,
          {
            name: 'test',
            value: tmp,
          },
        ],
      }));
    });
  }, [chart, data]);

  useEffect(() => {
    render();
  }, [render]);

  return (
    <Page title={'Debug'}>
      <div id={'chart'} className={'h-[500px]'}></div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <DebugWeb3 />
      <DebugTenderlyRPC />
      <DebugImposter />
    </Page>
  );
};
