import { FC } from 'react';
import { D3ChartHandleLine } from './D3ChartHandleLine';
import { useD3ChartCtx } from './D3ChartContext';
import { prettifyNumber } from 'utils/helpers';

interface Props {
  marketPrice?: number;
}
export const D3ChartMarketPrice: FC<Props> = ({ marketPrice }) => {
  const { yScale } = useD3ChartCtx();
  if (!marketPrice) return;
  return (
    <D3ChartHandleLine
      color="var(--color-main-0)"
      y={yScale(marketPrice)}
      lineProps={{ strokeDasharray: 2 }}
      label={prettifyNumber(marketPrice, { abbreviate: true })}
      className="pointer-events-none"
    />
  );
};
