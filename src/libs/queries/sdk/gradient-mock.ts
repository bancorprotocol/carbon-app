// @todo(gradient): remove this file when SDK is ready

export interface SDKGradientStrategy {
  id: string;
  baseToken: string;
  quoteToken: string;
  buy_SP_: string;
  buy_EP_: string;
  buyPriceMarginal: string;
  buy_SD_: string;
  buy_ED_: string;
  buyBudget: string;
  sell_SP_: string;
  sell_EP_: string;
  sellPriceMarginal: string;
  sell_SD_: string;
  sell_ED_: string;
  sellBudget: string;
  encoded: any;
}
