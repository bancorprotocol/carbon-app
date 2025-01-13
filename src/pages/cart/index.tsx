import { CartList } from 'components/cart/CartList';
import { EmptyCart } from 'components/cart/EmptyCart';
import { useStrategyCart } from 'components/cart/utils';
import { Button } from 'components/common/button';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { useBatcher } from 'hooks/useContract';
import { useWagmi } from 'libs/wagmi';
import { cn } from 'utils/helpers';
import { FormEvent } from 'react';
import style from 'components/strategies/common/form.module.css';

export const CartPage = () => {
  const strategies = useStrategyCart();
  const { user } = useWagmi();
  const { data: contract } = useBatcher();

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!!form.querySelector('.error-message')) return;
    const warnings = form.querySelector('.warning-message');
    if (warnings) {
      const approve = form.querySelector<HTMLInputElement>('#approve-warnings');
      if (approve && !approve.checked) return;
    }
    // const strategiesData = toStrategyData(strategies);
    // const tx = await contract?.write.batchCreate(strategiesData);
    // await tx?.wait();
  };

  const content = strategies.length ? (
    <CartList strategies={strategies} />
  ) : (
    <EmptyCart />
  );
  return (
    <form
      className={cn(
        'px-content pb-30 xl:px-50 mx-auto grid max-w-[1280px] flex-grow content-start gap-16 pt-20',
        style.form
      )}
      onSubmit={submit}
    >
      <h1 className="text-18 flex items-center gap-8">
        Create multiple strategies
        <Tooltip iconClassName="size-18 text-white/60" element="" />
      </h1>
      {content}
      <label
        htmlFor="approve-warnings"
        className={cn(
          style.approveWarnings,
          'text-14 font-weight-500 flex items-center gap-8 place-self-center p-20 text-white/60'
        )}
      >
        <input
          id="approve-warnings"
          type="checkbox"
          name="approval"
          className="size-18"
          data-testid="approve-warnings"
        />
        I've reviewed the warning(s) but choose to proceed
      </label>
      <Button
        type="submit"
        disabled={!contract || !user}
        variant="success"
        className="place-self-center"
      >
        Sign all strategies
      </Button>
    </form>
  );
};
