import { ScaleBand, ScaleLinear } from 'libs/d3';
import { Activity } from 'libs/queries/extApi/activity';
import { getUnixTime, startOfDay } from 'date-fns';
import { SafeDecimal } from 'libs/safedecimal';

interface Indicator {
  x: number;
  y: number;
  activities: Activity[];
}
const groupByIndicators = (activities?: Activity[]) => {
  if (!activities) return [];
  const operations: Record<string, Indicator> = {};
  const trades: Record<string, Indicator> = {};
  for (const activity of activities) {
    const day = getUnixTime(startOfDay(activity.date));
    if (activity.action === 'buy' || activity.action === 'sell') {
      trades[day] ||= { x: day, y: 0, activities: [] };
      trades[day].activities.push(activity);
    } else {
      operations[day] ||= { x: day, y: 0, activities: [] };
      operations[day].activities.push(activity);
    }
  }
  for (const indicator of Object.values(trades)) {
    const sum = indicator.activities.reduce((acc, activity) => {
      const { buy, sell } = activity.changes!;
      if (!buy?.budget || !sell?.budget) return acc;
      const price = new SafeDecimal(buy.budget).div(sell.budget);
      return acc.add(price);
    }, new SafeDecimal(0));
    indicator.y = sum.div(indicator.activities.length).toNumber();
  }
  return Object.values(operations).concat(Object.values(trades));
};

export type ChartPrices<T = string> = {
  buy: { min: T; max: T };
  sell: { min: T; max: T };
};

export type OnPriceUpdates = (props: ChartPrices) => void;

export interface D3ChartIndicatorsProps {
  xScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number>;
  activities: Activity[];
}

export const D3ChartIndicators = (props: D3ChartIndicatorsProps) => {
  const { xScale, yScale, activities } = props;
  const indicators = groupByIndicators(activities);
  return (
    <>
      {indicators.map((indicator, i) => (
        <g key={i} transform={`translate(${xScale(indicator.x.toString())},0)`}>
          <rect
            y={yScale(indicator.y)}
            width={10}
            height={10}
            fill="white"
            x={0}
          />
        </g>
      ))}
    </>
  );
};
