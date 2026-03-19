// @todo(gradient): remove this file when SDK is ready

export interface SDKGradientStrategy {
  id: string;
  baseToken: string;
  quoteToken: string;
  buyStartPrice: string;
  buyEndPrice: string;
  buyPriceMarginal: string;
  buyStartDate: string;
  buyEndDate: string;
  buyBudget: string;
  sellStartPrice: string;
  sellEndPrice: string;
  sellPriceMarginal: string;
  sellStartDate: string;
  sellEndDate: string;
  sellBudget: string;
  encoded: any;
}
