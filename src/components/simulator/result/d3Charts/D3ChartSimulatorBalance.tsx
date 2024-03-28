import {
  D3ChartTitle,
  useLinearScale,
  D3ChartSettings,
  max,
  ScaleBand,
  scaleBand,
  ScaleLinear,
} from 'libs/d3';
import { SimulatorReturn } from 'libs/queries';
import { Token } from 'libs/tokens';
import { FC } from 'react';
import { prettifyNumber } from 'utils/helpers';
import { ToggleEye } from './EyeIcon';

const colors = {
  base: 'var(--sell)',
  quote: 'var(--buy)',
};

interface Props {
  dms: D3ChartSettings;
  data: SimulatorReturn['data'];
  baseToken: Token;
  quoteToken: Token;
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}

export const D3ChartSimulatorBalance = ({
  dms,
  data,
  baseToken,
  quoteToken,
  isVisible,
  setIsVisible,
}: Props) => {
  const xScale = scaleBand()
    .domain(['base', 'quote'])
    .range([0, dms.boundedWidth])
    .padding(0.1);

  const balanceCASH = data.length ? data[data.length - 1].balanceCASH : 0;
  const balanceRISK = data.length ? data[data.length - 1].balanceRISK : 0;

  const portionCASH = data.length ? data[data.length - 1].portionCASH : 0;
  const portionRISK = data.length ? data[data.length - 1].portionRISK : 0;

  const y = useLinearScale({
    domain: [max([portionCASH, portionRISK]) as number, 0],
    range: [0, dms.boundedHeight],
  });

  const percentage = (portionRISK / (portionCASH + portionRISK)) * 100;

  const xBase = xScale('base');
  const xQuote = xScale('quote');

  const barWidth = xScale.bandwidth();
  // Hide the chart is not visible or if transitioning to visible (ResizeObserver takes 1 frame)
  const hide = !isVisible || dms.width === 80;

  if (data.length === 0) return null;
  if (!dms.width || !dms.height) return null;
  return (
    <>
      <ToggleChart
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        dms={dms}
        titleWidth={130}
        marginTop={(dms.marginTop - 20) * -1}
      />

      <g className={hide ? 'hidden' : ''}>
        <D3ChartTitle
          dms={dms}
          title="Token Balances"
          width={130}
          marginTop={(dms.marginTop - 20) * -1}
        />

        <Bar
          id="base"
          xScale={xScale}
          yScale={y.scale}
          label={balanceRISK}
          value={portionRISK}
          percentage={percentage}
          dms={dms}
          symbol={baseToken.symbol}
        />

        <Bar
          id="quote"
          xScale={xScale}
          yScale={y.scale}
          label={balanceCASH}
          value={portionCASH}
          percentage={100 - percentage}
          dms={dms}
          symbol={quoteToken.symbol}
        />

        <g>
          <line
            x1={0}
            x2={dms.boundedWidth}
            y1={dms.boundedHeight}
            y2={dms.boundedHeight}
            className="stroke-background-800"
          />
          <text
            x={(xBase ?? 0) + barWidth / 2}
            y={dms.boundedHeight + 20}
            fill="currentColor"
            style={{ textAnchor: 'middle' }}
            className="text-12"
          >
            {baseToken.symbol}
          </text>

          <text
            x={(xQuote ?? 0) + barWidth / 2}
            y={dms.boundedHeight + 20}
            fill="currentColor"
            style={{ textAnchor: 'middle' }}
            className="text-12"
          >
            {quoteToken.symbol}
          </text>
        </g>
      </g>
    </>
  );
};

interface BarProps {
  id: 'base' | 'quote';
  xScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number>;
  value: number;
  label: number;
  symbol: string;
  dms: D3ChartSettings;
  percentage: number;
}

const Bar = ({
  id,
  xScale,
  yScale,
  value,
  dms,
  percentage,
  label,
  symbol,
}: BarProps) => {
  const minValue = 2;
  const x = xScale(id);
  const y = yScale(value);
  const showMinHeight = dms.boundedHeight - y > minValue;
  const width = xScale.bandwidth();
  const height = showMinHeight ? dms.boundedHeight - y : minValue;

  return (
    <>
      <rect
        x={x}
        y={showMinHeight ? y : dms.boundedHeight - minValue}
        width={width}
        height={height}
        fill={colors[id]}
      />

      <text
        x={(x || 0) + width / 2}
        y={y - 30}
        fill="currentColor"
        style={{ textAnchor: 'middle' }}
        className="text-16 font-weight-500"
      >
        {percentage.toFixed(2)}%
      </text>

      <text
        x={(x ?? 0) + width / 2}
        y={y - 10}
        fill="currentColor"
        style={{ textAnchor: 'middle' }}
        className="text-14 text-white/60"
      >
        {prettifyNumber(label)} {symbol}
      </text>
    </>
  );
};

interface ToggleChartProps {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  dms: D3ChartSettings;
  titleWidth: number;
  marginTop: number;
}

const ToggleChart: FC<ToggleChartProps> = (props) => {
  const { isVisible, setIsVisible, dms, titleWidth, marginTop } = props;
  const toggle = () => setIsVisible(!isVisible);
  const center = dms.width / 2;
  const marginLeft = 12;

  const scale = isVisible ? 1 : 32 / 24;
  const x = isVisible ? center + titleWidth / 2 + marginLeft : center - 16;
  const y = marginTop;

  // Hide toggle if transitioning between state (ResizeObserver takes 1 frame)
  const hide = isVisible && dms.width === 80;
  const style = hide ? { opacity: 0, outline: 'none' } : {};

  const onKeyDown = (e: React.KeyboardEvent<SVGGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <g
      role="switch"
      tabIndex={0}
      transform={`translate(${x},${y}) scale(${scale})`}
      className="cursor-pointer rounded-full"
      onClick={toggle}
      onKeyDown={onKeyDown}
      aria-checked={isVisible}
      aria-label="Toggle chart visibility"
      style={style}
    >
      <circle
        cx="12"
        cy="12"
        r="11"
        fill="transparent"
        strokeWidth={2}
        className="stroke-background-800"
      />
      <ToggleEye
        visible={isVisible}
        transform="translate(5, 5)"
        className="text-white"
      />
    </g>
  );
};
