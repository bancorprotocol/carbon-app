export const getSpread = (min: number, max: number, spreadPPM: number) => {
  return ((max - min) * spreadPPM) / 100;
};

export const getBuyMarginalPrice = (marketPrice: number, spread: number) => {
  return marketPrice - spread / 2;
};
export const getSellMarginalPrice = (marketPrice: number, spread: number) => {
  return marketPrice + spread / 2;
};
