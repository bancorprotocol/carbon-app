interface ValidOrderParams {
  isRange: boolean;
  min: string;
  max: string;
  price: string;
}

export const isValidOrder = (order: ValidOrderParams) => {
  return order.isRange
    ? isValidRange(order.min, order.max)
    : isValidLimit(order.price);
};

export const isValidLimit = (value: string) => {
  const price = Number(value);
  return !isNaN(price) && price > 0;
};

export const isValidRange = (minStr: string, maxStr: string) => {
  const min = Number(minStr);
  const max = Number(maxStr);
  return !isNaN(min) && !isNaN(max) && min > 0 && min < max;
};

export const checkIfOrdersOverlap = (
  buy: { min: string; max: string },
  sell: { min: string; max: string },
): boolean => {
  const isSellMinInBuyRange =
    +sell.min < +buy.max &&
    +sell.min >= +buy.min &&
    +sell.min !== 0 &&
    +buy.min !== 0;
  const isSellMaxAboveBuyMax = +sell.max >= +buy.max;

  return isSellMinInBuyRange && isSellMaxAboveBuyMax;
};

export const checkIfOrdersReversed = (
  buyRaw: { min: string; max: string },
  sellRaw: { min: string; max: string },
): boolean => {
  const translateOrder = (order: { min: string; max: string }) => {
    const orderPrice = order.min === order.max ? +order.min : 0;
    return {
      price: orderPrice,
      min: +order.min,
      max: +order.max,
    };
  };

  const buy = translateOrder(buyRaw);
  const sell = translateOrder(sellRaw);

  const isSellMinBelowBuyMin = sell.min < buy.min && sell.min !== 0;
  const isSellMaxBelowBuyMax = sell.max < buy.max && sell.max !== 0;
  const isSellRangeSameAsBuyRange =
    sell.min === buy.min &&
    sell.max === buy.max &&
    buy.min !== 0 &&
    buy.max !== 0;

  // 2 range orders
  if (isSellMinBelowBuyMin || isSellMaxBelowBuyMax || isSellRangeSameAsBuyRange)
    return true;

  // limit buy and range sell
  if (buy.price >= sell.min && sell.min !== 0) return true;

  // range buy and limit sell
  if (buy.max >= sell.price && sell.price !== 0) return true;

  // 2 limit orders
  if (buy.price >= sell.price && sell.price !== 0) return true;

  return false;
};

export const getStatusTextByTxStatus = (
  isAwaiting: boolean,
  isProcessing: boolean,
): string | undefined => {
  if (isAwaiting) return 'Waiting for Confirmation';
  if (isProcessing) return 'Processing';
  return;
};
