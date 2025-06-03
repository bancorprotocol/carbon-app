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
import { useWagmi } from 'libs/wagmi';
import strategyStyle from 'components/strategies/overview/StrategyContent.module.css';
import formStyle from 'components/strategies/common/form.module.css';

export type Cart = (CreateStrategyParams & { id: string })[];

const toOrder = (sdkOrder: CreateStrategyOrder) => ({
  balance: sdkOrder.budget,
  startRate: sdkOrder.min,
  endRate: sdkOrder.max,
  marginalRate: sdkOrder.marginalPrice,
});

export const useStrategyCart = () => {
  const [cart, setCart] = useState<Cart>([]);
  const { user } = useWagmi();
  const { getTokenById } = useTokens();
  const { selectedFiatCurrency } = useFiatCurrency();

  const tokens = cart.map(({ base, quote }) => [base, quote]).flat();
  const addresses = Array.from(new Set(tokens));
  const priceQueries = useGetMultipleTokenPrices(addresses);

  useEffect(() => {
    if (!user) return setCart([]);
    const carts = lsService.getItem('carts') ?? {};
    setCart(carts[user] ?? []);
  }, [user]);

  useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key !== lsService.keyFormatter('carts')) return;
      if (!user) return;
      const next = JSON.parse(event.newValue ?? '{}');
      setCart(next[user] ?? []);
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

export const addStrategyToCart = (
  user: string,
  params: CreateStrategyParams,
) => {
  const id = crypto.randomUUID();
  const carts = lsService.getItem('carts') ?? {};
  carts[user] ||= [];
  carts[user].push({ id, ...params });
  lsService.setItem('carts', carts);

  // Animation
  const getTranslate = (target: HTMLElement, elRect: DOMRect) => {
    const { top, height, left, width } = target.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const radius = elRect.width / 2;
    const translateX = centerX - elRect.left - radius;
    const translateY = centerY - elRect.top - radius;
    return `translate(${translateX}px, ${translateY}px)`;
  };
  const source = document.querySelector<HTMLElement>(`.${formStyle.addCart}`);
  const target = document.getElementById('menu-cart-link');
  const el = document.getElementById('animate-cart-indicator');
  if (!source || !target || !el) return;
  const currentRect = el.getBoundingClientRect();
  const sourceTranslate = getTranslate(source, currentRect);
  const targetTranslate = getTranslate(target, currentRect);
  const animation = el.animate(
    [
      { opacity: 0, transform: `${sourceTranslate} scale(15)` },
      { opacity: 1, transform: sourceTranslate },
      { opacity: 1, transform: targetTranslate },
      { opacity: 0, transform: `${targetTranslate} scale(5)` },
    ],
    {
      duration: 1000,
      easing: 'cubic-bezier(0,.6,1,.4)',
    },
  );
  return animation.finished;
};

export const removeStrategyFromCart = async (
  user: string,
  strategy: CartStrategy,
) => {
  // Animate leaving strategy
  const keyframes = { opacity: 0, transform: 'scale(0.9)' };
  const option = {
    duration: 200,
    easing: 'cubic-bezier(.55, 0, 1, .45)',
    fill: 'forwards' as const,
  };
  await document.getElementById(strategy.id)?.animate(keyframes, option)
    .finished;

  // Delete from localstorage
  const current = lsService.getItem('carts') ?? {};
  if (!current[user]?.length) return;
  current[user] = current[user].filter(({ id }) => id !== strategy.id);
  lsService.setItem('carts', current);

  // Animate remaining strategies
  const selector = `.${strategyStyle.strategyList} > li`;
  const elements = document.querySelectorAll<HTMLElement>(selector);
  const boxes = new Map<HTMLElement, DOMRect>();
  for (const el of elements) {
    boxes.set(el, el.getBoundingClientRect());
  }
  let attempts = 0;
  const checkChange = () => {
    if (attempts > 10) return;
    attempts++;
    const updated = document.querySelectorAll<HTMLElement>(selector);
    if (elements.length === updated.length) {
      return requestAnimationFrame(checkChange);
    }
    for (const [el, box] of boxes.entries()) {
      const newBox = el.getBoundingClientRect();
      if (box.top === newBox.top && box.left === newBox.left) continue;
      const keyframes = [
        {
          transform: `translate(${box.left - newBox.left}px, ${
            box.top - newBox.top
          }px)`,
        },
        { transform: `translate(0px, 0px)` },
      ];
      el.animate(keyframes, {
        duration: 300,
        easing: 'cubic-bezier(.85, 0, .15, 1)',
      });
    }
  };
  requestAnimationFrame(checkChange);
};

export const clearCart = (user: string) => {
  const current = lsService.getItem('carts') ?? {};
  current[user] = [];
  lsService.setItem('carts', current);
};
