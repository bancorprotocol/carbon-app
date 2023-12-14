import { cashPortion } from 'libs/queries/extApi/mockData/cashPortion';
import { hodlValue } from 'libs/queries/extApi/mockData/hodlValue';
import { portfolioValue } from 'libs/queries/extApi/mockData/portfolioValue';
import { portfolioHodlQuotient } from './portfolioHodlQuotient';
import { SimulatorReturn } from 'libs/queries/extApi/simulator';
import { balanceTkn1 } from './balanceTkn1';
import { balanceTkn2 } from './balanceTkn2';
import { ask } from './ask';
import { bid } from './bid';
import { bounds } from './bounds';
import { date } from './date';
import { price } from './price';

export const simMockData: SimulatorReturn = {
  data: date
    .map((d, i) => ({
      // date: new Date(d).getTime(),
      date: i,
      price: Number(price[i]),
      ask: Number(ask[i]),
      bid: Number(bid[i]),
      portfolioOverHodl: Number(portfolioHodlQuotient[i]),
      portfolioValue: Number(portfolioValue[i]),
      hodlValue: Number(hodlValue[i]),
      balanceCASH: Number(balanceTkn1[i]),
      balanceRISK: Number(balanceTkn2[i]),
      portionCASH: Number(cashPortion[i]),
      portionRISK: 1,
    }))
    .filter((x) => !(x.date % 20)),
  bounds: {
    askMin: Number(bounds.ask.min),
    askMax: Number(bounds.ask.max),
    bidMin: Number(bounds.bid.min),
    bidMax: Number(bounds.bid.max),
  },
};
