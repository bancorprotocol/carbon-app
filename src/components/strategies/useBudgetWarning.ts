import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Token } from 'libs/tokens';

export const useBudgetWarning = (
  base: Token | undefined,
  quote: Token | undefined,
  buyBudget: string,
  sellBudget: string,
) => {
  const { getFiatValue: getFiatValueBase } = useFiatCurrency(base);
  const { getFiatValue: getFiatValueQuote } = useFiatCurrency(quote);

  const budgetInUsd = getFiatValueQuote(buyBudget).plus(
    getFiatValueBase(sellBudget),
  );

  return budgetInUsd.lt(0);
};
