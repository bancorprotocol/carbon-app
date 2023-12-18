import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { carbonApi } from 'utils/carbonApi';
import { FIVE_MIN_IN_MS } from 'utils/time';

export interface SimulatorParams {
  token0: string;
  token1: string;
  start: number;
  end: number;
  startingPortfolioValue: number;
  highRangeHighPriceCash: number;
  highRangeLowPriceCash: number;
  lowRangeHighPriceCash: number;
  lowRangeLowPriceCash: number;
  startRateHighRange: number;
  startRateLowRange: number;
  cashProportion: number;
  riskProportion: number;
  networkFee: number;
}

// interface SimulatorInput {
//   start: number;
//   end: number;
//   baseToken: string;
//   baseBudget: number;
//   quoteToken: string;
//   quoteBudget: number;
//   quotePortfolio: number;
//   sellMax: number;
//   sellMin: number;
//   sellStart: number;
//   buyMax: number;
//   buyMin: number;
//   buyStart: number;
//   networkFee: number;
// }
//
// interface SimulatorOutput {
//   data: Array<SimulatorData2>;
//   bounds: SimulatorBounds2;
// }

// interface SimulatorData2 {
//   date: number;
//   price: number;
//   sell: number;
//   buy: number;
//   baseBalance: number;
//   baseBudget: number;
//   quoteBalance: number;
//   quoteBudget: number;
//   quotePortfolio: number;
//   quoteHodl: number;
//   quotePortfolioHodlQuotient: number;
// }
//
// interface SimulatorBounds2 {
//   sellMax: number;
//   sellMin: number;
//   buyMax: number;
//   buyMin: number;
// }

export interface SimulatorResult {
  CASH: {
    balance: string[];
    bid: string[];
    bid_upper_bound: string;
    fee: string[];
    hodl_value: string[];
    min_bid: string;
    portfolio_value: string[];
    portion: string[];
  };
  RISK: {
    ask: string[];
    ask_lower_bound: string;
    balance: string[];
    fee: string[];
    max_ask: string;
    portion: string[];
    price: string[];
  };
  dates: number[];
  portfolio_over_hodl_quotient: string[];
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

export const useGetSimulator = (params: SimulatorParams) => {
  return useQuery<SimulatorReturn>(
    QueryKey.simulator(params),
    async () => {
      const res = await carbonApi.getSimulator(params);

      const data: SimulatorReturn = {
        data: res.dates.map((d, i) => ({
          date: d,
          price: Number(res.RISK.price[i]),
          ask: Number(res.RISK.ask[i]),
          bid: Number(res.CASH.bid[i]),
          balanceRISK: Number(res.RISK.balance[i]),
          portionRISK: Number(res.RISK.portion[i]),
          balanceCASH: Number(res.CASH.balance[i]),
          portionCASH: Number(res.CASH.portion[i]),
          portfolioValue: Number(res.CASH.portfolio_value[i]),
          hodlValue: Number(res.CASH.hodl_value[i]),
          portfolioOverHodl: Number(res.portfolio_over_hodl_quotient[i]),
        })),
        bounds: {
          askMax: Number(res.RISK.max_ask),
          askMin: Number(res.RISK.ask_lower_bound),
          bidMax: Number(res.CASH.bid_upper_bound),
          bidMin: Number(res.CASH.min_bid),
        },
      };

      // const res = await carbonApi.getSimulator(params);
      //
      // const data: SimulatorOutput = {
      //   data: res.dates.map((d, i) => ({
      //     date: d,
      //     price: Number(res.RISK.price[i]),
      //     sell: Number(res.RISK.ask[i]),
      //     buy: Number(res.CASH.bid[i]),
      //     baseBalance: Number(res.RISK.balance[i]),
      //     baseBudget: Number(res.RISK.portion[i]),
      //     quoteBalance: Number(res.CASH.balance[i]),
      //     quoteBudget: Number(res.CASH.portion[i]),
      //     quotePortfolio: Number(res.CASH.portfolio_value[i]),
      //     quoteHodl: Number(res.CASH.hodl_value[i]),
      //     quotePortfolioHodlQuotient: Number(
      //       res.portfolio_over_hodl_quotient[i]
      //     ),
      //   })),
      //   bounds: {
      //     sellMax: Number(res.RISK.max_ask),
      //     sellMin: Number(res.RISK.ask_lower_bound),
      //     buyMax: Number(res.CASH.bid_upper_bound),
      //     buyMin: Number(res.CASH.min_bid),
      //   },
      // };

      return data;
    },
    {
      staleTime: FIVE_MIN_IN_MS,
      retry: false,
    }
  );
};
