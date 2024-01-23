import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { SimulatorSearch } from 'libs/routing';
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
  price: string[];
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
};

export const useGetSimulator = (params: SimulatorSearch) => {
  return useQuery<SimulatorReturn>(
    QueryKey.simulator(params),
    async () => {
      const res = await carbonApi.getSimulator(params);

      const data: SimulatorReturn = {
        data: res.dates.map((d, i) => ({
          date: d,
          price: Number(res.price[i]),
          ask: Number(res.ask[i]),
          bid: Number(res.bid[i]),
          balanceRISK: Number(res.RISK.balance[i]),
          portionRISK: Number(res.portfolio_risk[i]),
          balanceCASH: Number(res.CASH.balance[i]),
          portionCASH: Number(res.portfolio_cash[i]),
          portfolioValue: Number(res.portfolio_value[i]),
          hodlValue: Number(res.hodl_value[i]),
          portfolioOverHodl: Number(res.portfolio_over_hodl[i]),
        })),
        bounds: {
          askMax: Number(res.max_ask),
          askMin: Number(res.min_ask),
          bidMax: Number(res.max_bid),
          bidMin: Number(res.min_bid),
        },
      };

      return data;
    },
    {
      staleTime: FIVE_MIN_IN_MS,
      retry: false,
    }
  );
};
