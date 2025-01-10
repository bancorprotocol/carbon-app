import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { useTokens } from 'hooks/useTokens';
import {
  CartStrategy,
  CreateStrategyOrder,
  CreateStrategyParams,
} from 'libs/queries';
import { useGetMultipleTokenPrices } from 'libs/queries/extApi/tokenPrice';
import { SafeDecimal } from 'libs/safedecimal';
import { useEffect, useMemo, useState } from 'react';
import { lsService } from 'services/localeStorage';

export type Cart = (CreateStrategyParams & { id: string })[];

const toOrder = (sdkOrder: CreateStrategyOrder) => ({
  balance: sdkOrder.budget,
  startRate: sdkOrder.min,
  endRate: sdkOrder.max,
  marginalRate: sdkOrder.marginalPrice,
});

export const useStrategyCart = () => {
  const [cart, setCart] = useState(lsService.getItem('cart') ?? []);
  const { getTokenById } = useTokens();
  const { selectedFiatCurrency } = useFiatCurrency();

  const tokens = cart.map(({ base, quote }) => [base, quote]).flat();
  const addresses = Array.from(new Set(tokens));
  const priceQueries = useGetMultipleTokenPrices(addresses);

  useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key !== lsService.keyFormatter('cart')) return;
      const next = JSON.parse(event.newValue ?? '[]');
      setCart(next);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  });

  return useMemo(() => {
    const prices: Record<string, number | undefined> = {};
    for (let i = 0; i < priceQueries.length; i++) {
      const address = addresses[i];
      const price = priceQueries[i].data?.[selectedFiatCurrency];
      prices[address] = price;
    }
    return cart.map((strategy): CartStrategy => {
      const basePrice = new SafeDecimal(prices[strategy.base] ?? 0);
      const quotePrice = new SafeDecimal(prices[strategy.quote] ?? 0);
      const base = basePrice.times(strategy.order1.budget);
      const quote = quotePrice.times(strategy.order0.budget);
      const total = base.plus(quote);
      return {
        // temporary id for react key
        id: strategy.id,
        // We know the tokens are imported because cart comes from localstorage
        base: getTokenById(strategy.base)!,
        quote: getTokenById(strategy.quote)!,
        order0: toOrder(strategy.order0),
        order1: toOrder(strategy.order1),
        fiatBudget: { base, quote, total },
      };
    });
  }, [addresses, cart, getTokenById, priceQueries, selectedFiatCurrency]);
};
