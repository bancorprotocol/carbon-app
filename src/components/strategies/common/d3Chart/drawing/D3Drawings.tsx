import { FC } from 'react';
import { DrawingMode } from './DrawingMenu';
import { D3DrawLine } from './D3DrawLine';
import { D3ChartSettings } from 'libs/d3';

interface Props {
  dms: D3ChartSettings;
  drawingMode?: DrawingMode;
}
export const D3Drawings: FC<Props> = ({ dms, drawingMode }) => {
  if (!drawingMode) return;
  if (drawingMode === 'line') return <D3DrawLine dms={dms} />;
};
