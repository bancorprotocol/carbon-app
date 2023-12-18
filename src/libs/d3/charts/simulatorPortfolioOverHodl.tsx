import { D3XAxis } from 'libs/d3/charts/simulatorPrice/D3XAxis';
import { useD3Chart } from 'libs/d3/D3ChartProvider';
import { SimulatorData, SimulatorReturn } from 'libs/queries';
import { useEffect } from 'react';
import { scaleLinear, extent, axisLeft, select, line } from 'd3';

export const D3ChartSimulatorPortfolioOverHodle = () => {
  const {
    svgRef,
    xScale,
    data: { data },
    dms,
  } = useD3Chart<SimulatorReturn>();

  useEffect(() => {
    const svg = select(svgRef.current).select('g');

    // svg
    //   .append('g')
    //   .attr('class', 'x-axis')
    //   .attr('transform', `translate(0,${dms.boundedHeight})`);

    svg.append('g').attr('class', 'y-axis');

    svg
      .append('path')
      .attr('class', 'price')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 1);
  }, [svgRef]);

  useEffect(() => {
    const svg = select(svgRef.current).select('g');

    const yDomain = () => {
      // const domain = extent(data, (d) => d.portfolioOverHodl);
      const domain = extent(data, (d) => d.portfolioValue);

      const min = domain[0] || 0;
      const max = domain[1] || 0;

      return [min, max];
    };

    const yScale = scaleLinear()
      .domain(yDomain())
      .range([dms.boundedHeight, 0]);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // svg.selectAll('.x-axis').call(axisBottom(xScale));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    svg.selectAll('.y-axis').call(axisLeft(yScale));

    const lineGenerator = line<SimulatorData>()
      .x((d) => xScale(d.date))
      // .y((d) => yScale(d.portfolioOverHodl));
      .y((d) => yScale(d.portfolioValue));

    svg.selectAll('.price').attr('d', lineGenerator(data));
  }, [data, dms.boundedHeight, dms.boundedWidth, svgRef, xScale]);

  return (
    <>
      <D3XAxis />
    </>
  );
};
