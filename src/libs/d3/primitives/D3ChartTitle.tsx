import { D3ChartSettings } from 'libs/d3/types';

interface Props {
  dms: D3ChartSettings;
  title: string;
  width: number;
  marginTop?: number;
}

export const D3ChartTitle = ({ dms, title, width, marginTop = 20 }: Props) => {
  return (
    <g
      transform={`translate(${dms.boundedWidth / 2 - width / 2},${marginTop})`}
    >
      <rect width={width} height={24} className="fill-background-800" rx={12} />
      <text
        x={width / 2}
        y={16}
        fill="currentColor"
        style={{ textAnchor: 'middle' }}
        className="text-12 font-weight-500"
      >
        {title}
      </text>
    </g>
  );
};
