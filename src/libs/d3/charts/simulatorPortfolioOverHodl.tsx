import { D3ChartProvider, useD3Chart } from 'libs/d3/D3ChartProvider';
import { D3ChartSettingsProps } from 'libs/d3/types';
import { useChartDimensions } from 'libs/d3/useChartDimensions';
import { SimulatorData, SimulatorReturn } from 'libs/queries';
import { useEffect } from 'react';
import { scaleLinear, extent, axisBottom, axisLeft, select, line } from 'd3';

type Props = {
  data: SimulatorReturn;
  settings: D3ChartSettingsProps;
};

export const D3ChartSimulatorPortfolioOverHodle = ({
  data,
  settings,
}: Props) => {
  const [wrapperRef, dms] = useChartDimensions(settings);
  const xScale = scaleLinear()
    .domain(extent(data.data, (d) => d.date) as [number, number])
    .range([0, dms.boundedWidth]);

  return (
    <D3ChartProvider dms={dms} data={data} ref={wrapperRef} xScale={xScale}>
      <Chart />
    </D3ChartProvider>
  );
};

function Chart() {
  const {
    svgRef,
    data: { data },
    dms,
  } = useD3Chart<SimulatorReturn>();

  useEffect(() => {
    const svg = select(svgRef.current).select('g');

    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${dms.boundedHeight})`);

    svg.append('g').attr('class', 'y-axis');

    svg
      .append('path')
      .attr('class', 'price')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 1);
  }, [dms.boundedHeight, svgRef]);

  useEffect(() => {
    const svg = select(svgRef.current).select('g');

    const yDomain = () => {
      // const domain = extent(data, (d) => d.portfolioOverHodl);
      const domain = extent(data, (d) => d.portfolioValue);

      const min = domain[0] || 0;
      const max = domain[1] || 0;

      return [min, max];
    };

    const xScale = scaleLinear()
      .domain(extent(data, (d) => d.date) as [number, number])
      .range([0, dms.boundedWidth]);

    const yScale = scaleLinear()
      .domain(yDomain())
      .range([dms.boundedHeight, 0]);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    svg.selectAll('.x-axis').call(axisBottom(xScale));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    svg.selectAll('.y-axis').call(axisLeft(yScale));

    const lineGenerator = line<SimulatorData>()
      .x((d) => xScale(d.date))
      // .y((d) => yScale(d.portfolioOverHodl));
      .y((d) => yScale(d.portfolioValue));

    svg.selectAll('.price').attr('d', lineGenerator(data));
  }, [data, dms.boundedHeight, dms.boundedWidth, svgRef]);

  return <></>;
}
