import { Link } from '@tanstack/react-router';
import { ReactComponent as CartIcon } from 'assets/icons/cart.svg';
import { useEffect, useState } from 'react';
import { lsService } from 'services/localeStorage';

export const MainMenuCart = () => {
  const [cartSize, setCartsize] = useState(
    lsService.getItem('cart')?.length ?? 0
  );
  useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key !== lsService.keyFormatter('cart')) return;
      const next = JSON.parse(event.newValue ?? '[]');
      setCartsize(next.length);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  });

  return (
    <Link
      id="menu-cart-link"
      to="/cart"
      className="bg-background-800 grid size-40 rounded-full p-10 [grid-template-areas:'stack']"
      aria-label="Cart page"
    >
      <CartIcon className="size-20 place-self-center text-white [grid-area:stack]" />
      {!!cartSize && (
        <span className="bg-success-light grid size-10 place-items-center justify-self-end rounded-full text-[8px] leading-[1.4] text-black [grid-area:stack]">
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
