import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Token } from 'libs/tokens';

export const useBudgetWarning = (
  base: Token | undefined,
  quote: Token | undefined,
  order0Budget: string,
  order1Budget: string,
) => {
  const { getFiatValue: getFiatValueBase } = useFiatCurrency(base);
  const { getFiatValue: getFiatValueQuote } = useFiatCurrency(quote);

  const budgetInUsd = getFiatValueQuote(order0Budget, true).plus(
    getFiatValueBase(order1Budget, true),
  );

  return budgetInUsd.lt(0);
};
