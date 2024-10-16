import { D3ChartSettings, ScaleBand, ScaleLinear } from 'libs/d3';
import { DrawingMode } from './drawing/DrawingMenu';
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
} from 'react';
import { ZoomTransform } from 'd3';

interface D3ChartContext {
  dms: D3ChartSettings;
  xScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number>;
  drawingMode?: DrawingMode;
  setDrawingMode: Dispatch<SetStateAction<DrawingMode>>;
  zoom?: ZoomTransform;
}

const D3ChartCtx = createContext<D3ChartContext>({} as any);

interface Props extends D3ChartContext {
  children: ReactNode;
}
export const D3ChartProvider: FC<Props> = ({ children, ...ctx }) => {
  return <D3ChartCtx.Provider value={ctx}>{children}</D3ChartCtx.Provider>;
};

export const useD3ChartCtx = () => useContext(D3ChartCtx);
