import { Link } from '@tanstack/react-router';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { ReactComponent as CartIcon } from 'assets/icons/cart.svg';

export const EmptyCart = () => {
  return (
    <section className="gap-30 py-50 border-background-800 animate-fade relative mx-auto grid h-[600px] w-full max-w-[1240px] place-items-center content-center rounded border-2 px-20 text-center">
      <div className="bg-background-800 grid rounded-full p-16 [grid-template-areas:'stack']">
        <CartIcon className="size-40 place-self-center text-white [grid-area:stack]" />
        <span className="bg-success-light grid size-16 place-items-center justify-self-end rounded-full text-[8px] leading-[1.4] text-black [grid-area:stack]">
          0
        </span>
      </div>
      <h2 className="max-w-[440px] text-[32px] leading-[36px]">
        Your Cart is Empty
      </h2>
      <Link to="/trade" className={buttonStyles({ variant: 'success' })}>
        Create
      </Link>
    </section>
  );
};
