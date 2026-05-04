import { SafeDecimal } from 'libs/safedecimal';
import { GradientOrderBlock, QuickGradientOrderBlock } from '../types';
import {
  defaultGradientEndDate,
  defaultGradientStartDate,
  gradientMarginalPrice,
} from '../gradient/utils';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ChartPoint, Drawing } from '../d3Chart/D3ChartContext';
import { ChannelSearch, QuickChannelSearch } from 'libs/routing/routes/trade';
import config from 'config';

export const deltaTypes = ['percent', 'token'] as const;
export type DeltaType = (typeof deltaTypes)[number];
export interface ChannelDelta {
  deltaType: DeltaType;
  deltaPrice?: string;
}

export const toDelta = (
  type: DeltaType,
  buyPrice: string,
  sellPrice: string,
) => {
  if (type === 'percent') {
    const percent = new SafeDecimal(buyPrice).div(sellPrice);
    const multiplier = new SafeDecimal(1).minus(percent);
    return multiplier.mul(100).toFixed(2);
  } else {
    return new SafeDecimal(sellPrice).minus(buyPrice).toString();
  }
};
export const fromDelta = (
  type: DeltaType,
  delta: string,
  otherPrice: string,
) => {
  const price = new SafeDecimal(otherPrice);
  if (type === 'percent') {
    const percent = new SafeDecimal(delta).div(100);
    const multiplier = new SafeDecimal(1).minus(percent);
    return price.mul(multiplier).toString();
  } else {
    return price.minus(delta).toString();
  }
};

export const defaultChannelOrder = (
  baseOrder: Partial<GradientOrderBlock>,
  marketPrice: number = 0,
): GradientOrderBlock => {
  const direction = baseOrder.direction ?? 'sell';
  const multiplier = direction === 'buy' ? 0.99 : 1.01;
  const price = new SafeDecimal(marketPrice ?? 0);
  const order = {
    startPrice: baseOrder.startPrice ?? price.mul(multiplier).toString(),
    endPrice: baseOrder.endPrice ?? price.mul(multiplier).toString(),
    startDate: baseOrder.startDate ?? defaultGradientStartDate,
    endDate: baseOrder.endDate ?? defaultGradientEndDate,
    budget: baseOrder.budget ?? '',
    direction: direction,
  };
  return {
    ...order,
    marginalPrice: gradientMarginalPrice(order),
  };
};

export const useGradientChannelOrder = (
  search: ChannelSearch,
  setSearch: (next: Partial<ChannelSearch>) => any,
  marketPrice?: number,
) => {
  const id = useId();
  const timeout = useRef<number>(null);
  const isStable = (token: string) => config.stableTokens.includes(token);
  const multi =
    isStable(search.base!) && isStable(search.quote!) ? 1.001 : 1.01;

  const deltaType = search.deltaType ?? 'percent';
  const baseDelta =
    search.deltaPrice ?? new SafeDecimal(multi).sub(1).mul(200).toString();

  const { baseBuy, baseSell } = useMemo(() => {
    const price = new SafeDecimal(marketPrice ?? 0);
    const baseSellOrder = {
      direction: 'sell' as const,
      startPrice: search.sellStartPrice ?? price.mul(multi).toString(),
      endPrice: search.sellEndPrice ?? price.mul(multi).toString(),
      startDate: search.sellStartDate ?? defaultGradientStartDate,
      endDate: search.sellEndDate ?? defaultGradientEndDate,
      budget: search.sellBudget ?? '',
    };
    const baseSell: GradientOrderBlock = {
      ...baseSellOrder,
      marginalPrice: gradientMarginalPrice(baseSellOrder),
    };
    const baseBuyOrder = {
      direction: 'buy' as const,
      startPrice: fromDelta(deltaType, baseDelta, baseSell.startPrice),
      endPrice: fromDelta(deltaType, baseDelta, baseSell.endPrice),
      startDate: baseSell.startDate,
      endDate: baseSell.endDate,
      budget: search.buyBudget || '',
    };
    const baseBuy: GradientOrderBlock = {
      ...baseBuyOrder,
      marginalPrice: gradientMarginalPrice(baseBuyOrder),
    };
    return { baseBuy, baseSell };
  }, [
    baseDelta,
    deltaType,
    marketPrice,
    multi,
    search.buyBudget,
    search.sellBudget,
    search.sellEndDate,
    search.sellEndPrice,
    search.sellStartDate,
    search.sellStartPrice,
  ]);

  const [sell, setSell] = useState(baseBuy);
  const [buy, setBuy] = useState(baseSell);
  const [deltaPrice, setDeltaPrice] = useState(search.deltaPrice ?? '2');

  useEffect(() => setSell(baseSell), [baseSell]);
  useEffect(() => setBuy(baseBuy), [baseBuy]);
  useEffect(() => setDeltaPrice(baseDelta), [baseDelta]);

  const drawing = useMemo<Drawing>(
    () => ({
      id: id,
      mode: 'channel',
      points: [
        {
          x: sell.startDate,
          y: Number(sell.startPrice),
        },
        {
          x: sell.endDate,
          y: Number(sell.endPrice),
        },
        {
          x: buy.startDate,
          y: Number(buy.startPrice),
        },
        {
          x: buy.endDate,
          y: Number(buy.endPrice),
        },
      ],
    }),
    [
      id,
      buy.endDate,
      buy.endPrice,
      buy.startDate,
      buy.startPrice,
      sell.endDate,
      sell.endPrice,
      sell.startDate,
      sell.startPrice,
    ],
  );

  const onDrawingUpdate = useCallback(
    (points: ChartPoint[]) => {
      if (!points.length) return; // Prevent delete
      const copy = structuredClone(points);
      const [buyStart, sellStart, buyEnd, sellEnd] = copy.sort((a, b) => {
        return a.x === b.x
          ? Number(a.y) - Number(b.y)
          : Number(a.x) - Number(b.x);
      });
      const sellStartPrice = sellStart.y.toString();
      const buyStartPrice = buyStart.y.toString();
      const delta = toDelta(deltaType, buyStartPrice, sellStartPrice);
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        setSearch({
          deltaPrice: delta,
          sellStartDate: sellStart.x,
          sellEndDate: sellEnd.x,
          sellStartPrice: sellStart.y.toString(),
          sellEndPrice: sellEnd.y.toString(),
        });
      }, 200);
      setDeltaPrice(delta);
      setSell((current) => ({
        ...current,
        startPrice: sellStart.y.toString(),
        endPrice: sellEnd.y.toString(),
        startDate: sellStart.x,
        endDate: sellEnd.x,
      }));
      setBuy((current) => ({
        ...current,
        startPrice: buyStart.y.toString(),
        endPrice: buyEnd.y.toString(),
        startDate: buyStart.x,
        endDate: buyEnd.x,
      }));
    },
    [deltaType, setSearch],
  );

  return {
    drawing,
    onDrawingUpdate,
    buy,
    sell,
    deltaPrice,
  };
};

export const useQuickGradientChannelOrder = (
  search: QuickChannelSearch,
  setSearch: (next: Partial<QuickChannelSearch>) => any,
  marketPrice?: number,
) => {
  const id = useId();
  const timeout = useRef<number>(null);
  const isStable = (token: string) => config.stableTokens.includes(token);
  const multi =
    isStable(search.base!) && isStable(search.quote!) ? 1.001 : 1.01;

  const deltaType = search.deltaType ?? 'percent';
  const baseDelta =
    search.deltaPrice ?? new SafeDecimal(multi).sub(1).mul(200).toString();

  const { baseBuy, baseSell } = useMemo(() => {
    const price = new SafeDecimal(marketPrice ?? 0);
    const baseSellOrder = {
      direction: 'sell' as const,
      startPrice: search.sellStartPrice ?? price.mul(multi).toString(),
      endPrice: search.sellEndPrice ?? price.mul(multi).toString(),
      budget: search.sellBudget ?? '',
      deltaTime: search.deltaTime ?? '30',
    };
    const baseSell: QuickGradientOrderBlock = {
      ...baseSellOrder,
      marginalPrice: baseSellOrder.startPrice,
    };
    const baseBuyOrder = {
      direction: 'buy' as const,
      startPrice: fromDelta(deltaType, baseDelta, baseSell.startPrice),
      endPrice: fromDelta(deltaType, baseDelta, baseSell.endPrice),
      budget: search.buyBudget || '',
      deltaTime: search.deltaTime ?? '30',
    };
    const baseBuy: QuickGradientOrderBlock = {
      ...baseBuyOrder,
      marginalPrice: baseBuyOrder.startPrice,
    };
    return { baseBuy, baseSell };
  }, [
    baseDelta,
    deltaType,
    marketPrice,
    multi,
    search.buyBudget,
    search.deltaTime,
    search.sellBudget,
    search.sellEndPrice,
    search.sellStartPrice,
  ]);

  const [sell, setSell] = useState(baseBuy);
  const [buy, setBuy] = useState(baseSell);
  const [deltaPrice, setDelta] = useState(search.deltaPrice ?? '2');

  useEffect(() => setSell(baseSell), [baseSell]);
  useEffect(() => setBuy(baseBuy), [baseBuy]);
  useEffect(() => setDelta(baseDelta), [baseDelta]);

  const drawing = useMemo<Drawing>(
    () => ({
      id: id,
      mode: 'channel',
      points: [
        {
          x: '0',
          y: Number(sell.startPrice),
        },
        {
          x: sell.deltaTime,
          y: Number(sell.endPrice),
        },
        {
          x: '0',
          y: Number(buy.startPrice),
        },
        {
          x: buy.deltaTime,
          y: Number(buy.endPrice),
        },
      ],
    }),
    [
      id,
      buy.deltaTime,
      buy.endPrice,
      buy.startPrice,
      sell.deltaTime,
      sell.endPrice,
      sell.startPrice,
    ],
  );

  const onDrawingUpdate = useCallback(
    (points: ChartPoint[]) => {
      if (!points.length) return; // Prevent delete
      const copy = structuredClone(points);
      const [buyStart, sellStart, buyEnd, sellEnd] = copy.sort((a, b) => {
        return a.x === b.x
          ? Number(a.y) - Number(b.y)
          : Number(a.x) - Number(b.x);
      });
      const sellStartPrice = sellStart.y.toString();
      const buyStartPrice = buyStart.y.toString();
      const deltaPrice = toDelta(deltaType, buyStartPrice, sellStartPrice);
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        setSearch({
          deltaPrice: deltaPrice,
          sellStartPrice: sellStart.y.toString(),
          sellEndPrice: sellEnd.y.toString(),
          deltaTime: sellEnd.x,
        });
      }, 200);
      setDelta(deltaPrice);
      setSell((current) => ({
        ...current,
        startPrice: sellStart.y.toString(),
        endPrice: sellEnd.y.toString(),
        deltaTime: sellEnd.x,
      }));
      setBuy((current) => ({
        ...current,
        startPrice: buyStart.y.toString(),
        endPrice: buyEnd.y.toString(),
        deltaTime: buyEnd.x,
      }));
    },
    [deltaType, setSearch],
  );

  return {
    drawing,
    onDrawingUpdate,
    buy,
    sell,
    deltaPrice,
  };
};
