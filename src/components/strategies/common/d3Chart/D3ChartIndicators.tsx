import {
  FloatTooltip,
  FloatTooltipContent,
  FloatTooltipTrigger,
} from 'components/common/tooltip/FloatTooltip';
import { endOfWeek, isSameDay, isSameWeek, startOfWeek } from 'date-fns';
import { Activity } from 'libs/queries/extApi/activity';
import { SafeDecimal } from 'libs/safedecimal';
import { FC, ReactNode } from 'react';
import { useD3ChartCtx } from './D3ChartContext';

interface Indicator {
  x: number;
  y: number;
  label: string;
  activities: Activity[];
}

const formatter = new Intl.DateTimeFormat();

const displayDay = (date: Date) => formatter.format(date);
const displayWeek = (date: Date) =>
  formatter.formatRange(startOfWeek(date), endOfWeek(date));

const groupByIndicators = (activities: Activity[], domain: string[]) => {
  const points = domain.map((d) => new Date(Number(d) * 1000));
  const operations: Record<number, Indicator> = {};
  const trades: Record<number, Indicator> = {};
  const isSame = points.length > 60 ? isSameWeek : isSameDay;
  const getLabel = points.length > 60 ? displayWeek : displayDay;
  for (const activity of activities) {
    const closest = points.find((point) => isSame(point, activity.date));
    const key = (closest ?? points.at(-1)!).getTime() / 1000;
    const action = activity.action;
    const list = action === 'buy' || action === 'sell' ? trades : operations;
    list[key] ||= {
      x: key,
      y: 0,
      label: getLabel(activity.date),
      activities: [],
    };
    list[key].activities.push(activity);
  }
  for (const indicator of Object.values(trades)) {
    const sum = indicator.activities.reduce((acc, activity) => {
      const { buy, sell } = activity.changes!;
      if (!buy?.budget || !sell?.budget) return acc;
      const price = new SafeDecimal(buy.budget).div(sell.budget);
      return acc.add(price);
    }, new SafeDecimal(0));
    indicator.y = sum.div(indicator.activities.length).abs().toNumber();
  }
  return {
    operations: Object.values(operations),
    trades: Object.values(trades),
  };
};

export interface D3ChartIndicatorsProps {
  activities: Activity[];
}

export const D3ChartIndicators = ({ activities }: D3ChartIndicatorsProps) => {
  const { xScale, yScale, dms } = useD3ChartCtx();
  const height = dms.boundedHeight;
  const { operations, trades } = groupByIndicators(activities, xScale.domain());
  return (
    <>
      {operations.map((indicator, i) => {
        const { x } = indicator;
        return (
          <IndicatorTooltip key={i} indicator={indicator}>
            <g transform={`translate(${xScale(x.toString())},${height - 10})`}>
              <rect
                className="transformBox-fill origin-center rotate-45"
                x={xScale.bandwidth() / 2 - 4}
                y={xScale.bandwidth() / 2 - 4}
                width={8}
                height={8}
                fill="white"
                stroke="black"
              />
            </g>
          </IndicatorTooltip>
        );
      })}
      {trades.map((indicator, i) => {
        const { x, y } = indicator;
        const isBelowAxis = yScale(y) > height - 10;
        const translateY = Math.min(yScale(y), height - 10);
        return (
          <IndicatorTooltip key={i} indicator={indicator}>
            <g transform={`translate(${xScale(x.toString())},${translateY})`}>
              <circle
                cx={xScale.bandwidth() / 2}
                cy={xScale.bandwidth() / 2}
                r={5}
                fill={isBelowAxis ? 'url(#svg-brand-gradient)' : 'white'}
                stroke="black"
              />
            </g>
          </IndicatorTooltip>
        );
      })}
    </>
  );
};

interface TooltipProps {
  indicator: Indicator;
  children: ReactNode;
}
const IndicatorTooltip: FC<TooltipProps> = (props) => {
  const { indicator, children } = props;
  return (
    <FloatTooltip>
      <FloatTooltipTrigger>{children}</FloatTooltipTrigger>
      <FloatTooltipContent className="bg-background-800 text-12 font-weight-500 flex max-h-[300px] flex-col items-center gap-8 overflow-auto rounded p-16 text-white/80">
        <span>{indicator.label}</span>
        <span className="rounded-8 border border-white/80 px-8 py-4">
          {indicator.activities.length}&nbsp;
          {indicator.y ? 'Trade(s)' : 'Actions(s)'}
        </span>
      </FloatTooltipContent>
    </FloatTooltip>
  );
};
