import { useD3Chart } from 'libs/d3/D3ChartProvider';
import { SimulatorReturn } from 'libs/queries';
import { useEffect } from 'react';
import { scaleLinear, scaleBand, max, axisBottom, axisLeft, select } from 'd3';

export const D3ChartSimulatorBalance = () => {
  const {
    svgRef,
    data: { data },
    dms,
  } = useD3Chart<SimulatorReturn>();

  const balanceCASH = data.length ? data[data.length - 1].balanceCASH : 0;
  const balanceRISK = data.length ? data[data.length - 1].balanceRISK : 0;

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

    svg.append('rect').attr('class', 'barTkn1').attr('fill', 'green');

    svg.append('rect').attr('class', 'barTkn2').attr('fill', 'red');
  }, [dms.boundedHeight, svgRef]);

  useEffect(() => {
    const svg = select(svgRef.current).select('g');

    const xScale = scaleBand()
      .domain(['tkn1', 'tkn2'])
      .range([0, dms.boundedWidth])
      .padding(0.1);

    const yScale = scaleLinear()
      .domain([max([balanceCASH, balanceRISK]) as number, 0])
      .range([0, dms.boundedHeight]);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    svg.selectAll('.x-axis').call(axisBottom(xScale));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    svg.selectAll('.y-axis').call(axisLeft(yScale));

    svg
      .selectAll('.barTkn1')
      .attr('x', xScale('tkn1') ?? 0)
      .attr('width', xScale.bandwidth())
      .attr('y', yScale(balanceCASH))
      .attr('height', yScale(0) - yScale(balanceCASH));

    svg
      .selectAll('.barTkn2')
      .attr('x', xScale('tkn2') ?? 0)
      .attr('width', xScale.bandwidth())
      .attr('y', yScale(balanceRISK))
      .attr('height', yScale(0) - yScale(balanceRISK));
  }, [balanceCASH, balanceRISK, dms.boundedHeight, dms.boundedWidth, svgRef]);

  return <></>;
};
