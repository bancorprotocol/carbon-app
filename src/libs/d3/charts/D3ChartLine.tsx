import { D3XAxis } from 'libs/d3/charts/simulatorPrice/D3XAxis';
import { useD3Chart } from 'libs/d3/D3ChartProvider';
import { D3LinePath } from 'libs/d3/primitives/D3LinePath';
import { SimulatorData, SimulatorReturn } from 'libs/queries';
import { useEffect } from 'react';
import { scaleLinear, extent, axisLeft, select } from 'd3';

type Props = {
  accessorKey: keyof SimulatorData;
};

export const D3ChartLine = ({ accessorKey }: Props) => {
  const {
    svgRef,
    xScale,
    data: { data },
    dms,
  } = useD3Chart<SimulatorReturn>();

  const yScale = scaleLinear()
    .domain(extent(data, (d) => d[accessorKey]) as [number, number])
    .range([dms.boundedHeight, 0]);

  useEffect(() => {
    const svg = select(svgRef.current).select('g');

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

    // @ts-ignore
    svg.selectAll('.y-axis').call(axisLeft(yScale));
  }, [svgRef, yScale]);

  return (
    <>
      <D3LinePath
        xAcc={(d) => xScale(d.date)}
        yAcc={(d) => yScale(d[accessorKey])}
        data={data}
      />
      <D3XAxis />
    </>
  );
};
