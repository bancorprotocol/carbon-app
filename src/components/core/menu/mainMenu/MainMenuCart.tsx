import { Link } from '@tanstack/react-router';
import { ReactComponent as CartIcon } from 'assets/icons/cart.svg';
import { useEffect, useState } from 'react';
import { lsService } from 'services/localeStorage';
import style from 'components/strategies/common/form.module.css';

const getTranslate = (target: HTMLElement, elRect: DOMRect) => {
  const { top, height, left, width } = target.getBoundingClientRect();
  const centerX = left + width / 2;
  const centerY = top + height / 2;
  const radius = elRect.width / 2;
  const translateX = centerX - elRect.left - radius;
  const translateY = centerY - elRect.top - radius;
  return `translate(${translateX}px, ${translateY}px)`;
};

const runAnimation = () => {
  const source = document.querySelector<HTMLElement>(`.${style.addCart}`);
  const target = document.getElementById('menu-cart-link');
  const el = document.getElementById('animate-cart-indicator');
  if (!source || !target || !el) return;
  const currentRect = el.getBoundingClientRect();
  const sourceTranslate = getTranslate(source, currentRect);
  const targetTranslate = getTranslate(target, currentRect);
  el.animate(
    [
      { opacity: 0, transform: `${sourceTranslate} scale(15)` },
      { opacity: 1, transform: sourceTranslate },
      { opacity: 1, transform: targetTranslate },
      { opacity: 0, transform: `${targetTranslate} scale(5)` },
    ],
    {
      duration: 1000,
      easing: 'cubic-bezier(0,.6,1,.4)',
    }
  );
};

export const MainMenuCart = () => {
  const [cartSize, setCartsize] = useState(
    lsService.getItem('cart')?.length ?? 0
  );
  useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key !== lsService.keyFormatter('cart')) return;
      const next = JSON.parse(event.newValue ?? '[]');
      if (next.length > cartSize) runAnimation();
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
