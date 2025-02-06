import { Link, useRouterState } from '@tanstack/react-router';
import { ReactComponent as CartIcon } from 'assets/icons/cart.svg';
import { useWagmi } from 'libs/wagmi';
import { useEffect, useState } from 'react';
import { lsService } from 'services/localeStorage';

export const MainMenuCart = () => {
  const { pathname } = useRouterState().location;
  const { user } = useWagmi();
  const [cartSize, setCartsize] = useState(0);
  useEffect(() => {
    if (!user) return setCartsize(0);
    const carts = lsService.getItem('carts') ?? {};
    setCartsize((carts[user] ?? []).length);
  }, [user]);

  useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key !== lsService.keyFormatter('carts')) return;
      if (!user) return;
      const next = JSON.parse(event.newValue ?? '{}');
      setCartsize((next[user] ?? []).length);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  });

  if (!user) return;

  return (
    <Link
      id="menu-cart-link"
      to="/cart"
      className="bg-background-800 hover:border-background-700 grid size-40 rounded-full border-2 border-transparent p-6 [grid-template-areas:'stack'] aria-[current=page]:border-white"
      aria-label="Cart page"
      aria-current={pathname.startsWith('/cart') ? 'page' : 'false'}
    >
      <CartIcon className="size-20 place-self-center text-white [grid-area:stack]" />
      {!!cartSize && (
        <span className="bg-success-light grid size-12 place-items-center justify-self-end rounded-full text-[10px] leading-tight text-black [grid-area:stack]">
          {cartSize}
        </span>
      )}
      <div
        id="animate-cart-indicator"
        className="bg-success-light pointer-events-none fixed size-20 rounded-full opacity-0"
      ></div>
    </Link>
  );
};
