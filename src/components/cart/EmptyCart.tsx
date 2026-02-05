import { Link } from '@tanstack/react-router';
import CartIcon from 'assets/icons/cart.svg?react';

export const EmptyCart = () => {
  return (
    <section className="surface gap-30 py-50 animate-fade relative mx-auto grid h-[600px] w-full max-w-[1240px] place-items-center content-center rounded-2xl px-20 text-center">
      <div className="grid rounded-full p-16 [grid-template-areas:'stack']">
        <CartIcon className="size-40 place-self-center text-main-0 [grid-area:stack]" />
        <span className="bg-primary grid size-16 place-items-center justify-self-end rounded-full text-[8px] leading-[1.4] text-main-950 [grid-area:stack]">
          0
        </span>
      </div>
      <h2 className="max-w-[440px] text-[32px] leading-[36px]">
        Your Cart is Empty
      </h2>
      <Link to="/trade" className="btn-primary-gradient">
        Create
      </Link>
    </section>
  );
};
