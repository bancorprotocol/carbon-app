import { isNil } from 'lodash';
import { createContext, forwardRef, useContext, useRef } from 'react';
import { D3ChartContext, D3ChartData, D3ChartProviderProps } from './types';

const D3ChartCTX = createContext<D3ChartContext | undefined>(undefined);

export const useD3Chart = <Data extends D3ChartData>() => {
  const ctx = useContext(D3ChartCTX);
  if (isNil(ctx)) {
    throw new Error('No context found for D3 chart provider.');
  }
  const data = ctx.data as Data;
  return { ...ctx, data };
};

export const D3ChartProvider = forwardRef<HTMLDivElement, D3ChartProviderProps>(
  (
    {
      children,
      dms,
      data = {
        data: [],
        bounds: { askMax: 0, askMin: 0, bidMax: 0, bidMin: 0 },
      },
      xScale,
    },
    ref
  ) => {
    const svgRef = useRef<SVGSVGElement>(null);

    return (
      <D3ChartCTX.Provider value={{ svgRef, dms, data, xScale }}>
        <svg ref={svgRef} width={dms.width} height={dms.height}>
          <g transform={`translate(${dms.marginLeft},${dms.marginTop})`}>
            {children}
          </g>
        </svg>
      </D3ChartCTX.Provider>
    );
  }
);
