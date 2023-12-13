import { useChartDimensions } from 'libs/d3/useChartDimensions';
import { isNil } from 'lodash';
import { createContext, FC, useContext, useRef } from 'react';
import { D3ChartContext, D3ChartData, D3ChartProviderProps } from './types';

const defaultValue: D3ChartContext = {
  // @ts-ignore
  svgRef: null,
  dms: {
    width: 0,
    height: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    boundedWidth: 0,
    boundedHeight: 0,
  },
  data: [],
};

const D3ChartCTX = createContext(defaultValue);

export const useD3Chart = <Data extends D3ChartData>() => {
  const ctx = useContext(D3ChartCTX);
  if (isNil(ctx)) {
    throw new Error('No context found for D3 chart provider.');
  }
  const data = ctx.data as Data;
  return { ...ctx, data };
};

export const D3ChartProvider: FC<D3ChartProviderProps> = ({
  children,
  settings,
  data,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [wrapperRef, dms] = useChartDimensions(settings);

  return (
    <D3ChartCTX.Provider value={{ svgRef, dms, data }}>
      <div ref={wrapperRef} className={'bg-white text-black'}>
        <svg ref={svgRef} width={dms.width} height={dms.height}>
          <g transform={`translate(${dms.marginLeft},${dms.marginTop})`}>
            {children}
          </g>
        </svg>
      </div>
    </D3ChartCTX.Provider>
  );
};
