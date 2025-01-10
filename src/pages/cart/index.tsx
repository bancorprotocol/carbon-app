import { CartList } from 'components/cart/CartList';
import { EmptyCart } from 'components/cart/EmptyCart';
import { useStrategyCart } from 'components/cart/utils';
import { Tooltip } from 'components/common/tooltip/Tooltip';

export const CartPage = () => {
  const strategies = useStrategyCart();

  const content = strategies.length ? (
    <CartList strategies={strategies} />
  ) : (
    <EmptyCart />
  );
  return (
    <div className="px-content pb-30 xl:px-50 mx-auto grid max-w-[1280px] flex-grow content-start gap-16 pt-20">
      <h1 className="text-18 flex items-center gap-8">
        Create multiple strategies
        <Tooltip iconClassName="size-18 text-white/60" element="" />
      </h1>
      {content}
    </div>
  );
};
