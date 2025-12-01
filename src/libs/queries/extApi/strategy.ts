export interface StrategyAPI {
  id: string;
  owner: string;
  base: string;
  quote: string;
  buy: {
    budget: string;
    min: string;
    max: string;
    marginal: string;
  };
  sell: {
    budget: string;
    min: string;
    max: string;
    marginal: string;
  };
}
