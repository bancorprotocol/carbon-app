import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { SimulatorResultSearch } from 'libs/routing';
import { carbonApi } from 'utils/carbonApi';
import { FIVE_MIN_IN_MS } from 'utils/time';

export interface SimulatorResult {
  CASH: {
    balance: string[];
    fee: string[];
  };
  RISK: {
    balance: string[];
    fee: string[];
  };
  dates: number[];
  min_bid: string;
  max_bid: string;
  min_ask: string;
  max_ask: string;
  bid: string[];
  ask: string[];
  hodl_value: string[];
  portfolio_cash: string[];
  portfolio_risk: string[];
  portfolio_value: string[];
  portfolio_over_hodl: string[];
  prices: string[];
}

export type SimulatorData = {
  date: number;
  price: number;
  ask: number;
  bid: number;
  portfolioOverHodl: number;
  portfolioValue: number;
  hodlValue: number;
  balanceCASH: number;
  portionCASH: number;
  balanceRISK: number;
  portionRISK: number;
};

export type SimulatorBounds = {
  askMin: number;
  askMax: number;
  bidMin: number;
  bidMax: number;
};

export type SimulatorReturn = {
  data: Array<SimulatorData>;
  bounds: SimulatorBounds;
  roi?: number;
  gains?: number;
};

export interface SimulatorDataNew {
  date: number;
  price: string;
  sell: string;
  buy: string;
  portfolioOverHodlInPercent: string;
  portfolioValueInQuote: string;
  hodlValueInQuote: string;
  baseBalance: string;
  basePortion: string;
  quoteBalance: string;
  quotePortion: string;
}

interface SimulatorBoundsNew {
  sellMin: string;
  sellMax: string;
  buyMin: string;
  buyMax: string;
}

export interface SimulatorReturnNew {
  data: Array<SimulatorDataNew>;
  bounds: SimulatorBoundsNew;
  roiInPercent: string;
  gainsInQuote: string;
}

export type SimulatorAPIParams = Omit<
  SimulatorResultSearch,
  'buyIsRange' | 'sellIsRange' | 'type' | 'overlappingSpread'
>;

export const useGetSimulator = (search: SimulatorResultSearch) => {
  return useQuery<SimulatorReturn, Error>({
    queryKey: QueryKey.simulator(search),
    queryFn: async () => {
      try {
        // eslint-disable-next-line unused-imports/no-unused-vars
        const { buyIsRange, sellIsRange, type, spread, ...params } = search;
        const res = await carbonApi.getSimulator(params);

        // TODO cleanup schema
        const data: SimulatorReturn = {
          data: res.data.map((x) => ({
            date: x.date,
            price: Number(x.price),
            ask: Number(x.sell),
            bid: Number(x.buy),
            balanceRISK: Number(x.baseBalance),
            portionRISK: Number(x.basePortion),
            balanceCASH: Number(x.quoteBalance),
            portionCASH: Number(x.quotePortion),
            portfolioValue: Number(x.portfolioValueInQuote),
            hodlValue: Number(x.hodlValueInQuote),
            portfolioOverHodl: Number(x.portfolioOverHodlInPercent),
          })),
          bounds: {
            askMax: Number(res.bounds.sellMax),
            askMin: Number(res.bounds.sellMin),
            bidMax: Number(res.bounds.buyMax),
            bidMin: Number(res.bounds.buyMin),
          },
          roi: Number(res.roiInPercent),
          gains: Number(res.gainsInQuote),
        };

        return data;
      } catch (e: any) {
        console.error('failed to fetch simulator result data.', e.message);
        if (e.message) throw new Error(e.message);
        throw new Error('Unknown internal error.');
      }
    },
    staleTime: FIVE_MIN_IN_MS,
    retry: false,
  });
};
