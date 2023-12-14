import { D3SimPriceRange } from 'libs/d3/charts/simulatorPrice/D3SimPriceRange';
import {
  getAccessor,
  getPriceDomain,
} from 'libs/d3/charts/simulatorPrice/utils';
import { useD3Chart } from 'libs/d3/D3ChartProvider';
import { D3LinePath } from 'libs/d3/primitives/D3LinePath';
import { SimulatorReturn } from 'libs/queries/extApi/simulator';
import { useEffect } from 'react';
import { scaleLinear, axisBottom, axisLeft, select } from 'd3';

export const D3ChartSimulatorPrice = () => {
  const {
    svgRef,
    xScale,
    dms,
    data: { data, bounds },
  } = useD3Chart<SimulatorReturn>();

  const yDomain = getPriceDomain({ data, bounds });

  const yLeftScale = scaleLinear()
    .domain(yDomain)
    .range([dms.boundedHeight, 0]);
  // const yRightScale = scaleLinear()
  //   // TODO check hodle value as well
  //   .domain([0, max(data, (d) => d.portfolioValue) as number])
  //   .range([dms.boundedHeight, 0]);

  useEffect(() => {
    const svg = select(svgRef.current);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    svg.selectAll('.y-axis').call(axisLeft(yLeftScale));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // svg.selectAll('.y2-axis').call(axisRight(yRightScale));
  }, [yLeftScale]);

  const xAcc = getAccessor('date', xScale);
  const priceAcc = getAccessor('price', yLeftScale);
  // const portfolioAcc = getAccessor('portfolioValue', yRightScale);
  // const hodlAcc = getAccessor('hodlValue', yRightScale);
  // const portionAcc = getAccessor('portionCASH', yRightScale);

  return (
    <>
      <XAxis />
      <g className="y-axis"></g>
      {/*<g className="y2-axis" transform={`translate(${dms.boundedWidth},0)`}></g>*/}
      <D3SimPriceRange type={'bid'} yScale={yLeftScale} />
      <D3SimPriceRange type={'ask'} yScale={yLeftScale} />
      <D3LinePath data={data} xAcc={xAcc} yAcc={priceAcc} />
      {/*<D3LinePath data={data} xAcc={xAcc} yAcc={portfolioAcc} />*/}
      {/*<D3LinePath data={data} xAcc={xAcc} yAcc={hodlAcc} />*/}
      {/*<D3LinePath data={data} xAcc={xAcc} yAcc={portionAcc} />*/}
    </>
  );
};

const XAxis = () => {
  const { svgRef, xScale, dms } = useD3Chart<SimulatorReturn>();

  useEffect(() => {
    select(svgRef.current).select('.x-axis').call(axisBottom(xScale));
  }, [xScale]);

  return (
    <g className="x-axis" transform={`translate(0,${dms.boundedHeight})`}></g>
  );
};
