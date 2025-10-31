import { FC, FormEvent, MouseEvent, ReactNode, useState } from 'react';
import { Token } from 'libs/tokens';
import { useNavigate } from 'libs/routing';
import { Button } from 'components/common/button';
import { useCreateStrategy } from './useCreateStrategy';
import { getStatusTextByTxStatus } from '../utils';
import { cn } from 'utils/helpers';
import { useWagmi } from 'libs/wagmi';
import { FormStaticOrder } from 'components/strategies/common/types';
import { addStrategyToCart, toStaticCartStorage } from 'components/cart/utils';
import style from 'components/strategies/common/form.module.css';
import config from 'config';

interface FormProps {
  base: Token;
  quote: Token;
  buy: FormStaticOrder;
  sell: FormStaticOrder;
  children: ReactNode;
}

export const CreateForm: FC<FormProps> = (props) => {
  const { base, quote, buy, sell, children } = props;
  const { user, openConnect } = useWagmi();
  const nav = useNavigate();

  const [animating, setAnimating] = useState(false);

  const { isLoading, isProcessing, isAwaiting, createStrategy } =
    useCreateStrategy({ base, quote, buy, sell });

  const loading = isLoading || isProcessing || isAwaiting;
  const loadingChildren = getStatusTextByTxStatus(isAwaiting, isProcessing);

  const isDisabled = (form: HTMLFormElement) => {
    if (!form.checkValidity()) return true;
    if (form.querySelector('.loading-message')) return true;
    if (form.querySelector('.error-message')) return true;
    const warnings = form.querySelector('.warning-message');
    if (!warnings) return false;
    return !form.querySelector<HTMLInputElement>('#approve-warnings')?.checked;
  };

  const addToCart = async (e: MouseEvent<HTMLButtonElement>) => {
    if (!user) return;
    const form = e.currentTarget.form!;
    if (!form.checkValidity()) return;
    if (form.querySelector('.loading-message')) return;
    if (form.querySelector('.error-message')) return;

    setAnimating(true);
    const params = toStaticCartStorage(base, quote, buy, sell);
    await addStrategyToCart(user, params);
    setAnimating(false);
    // Remove budget
    nav({
      to: '.',
      search: (s) => ({
        ...s,
        budget: undefined,
        sellBudget: undefined,
        buyBudget: undefined,
      }),
      replace: false,
      resetScroll: false,
    });
  };

  const create = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDisabled(e.currentTarget)) return;
    createStrategy();
  };

  return (
    <form
      onSubmit={create}
      style={{ animationDelay: '100ms' }}
      className={cn(style.form, 'grid')}
      data-testid="create-strategy-form"
    >
      <div className="overflow-hidden rounded-2xl surface">{children}</div>
      <footer className="mt-16 grid gap-16">
        <label
          htmlFor="approve-warnings"
          className={cn(
            style.approveWarnings,
            'surface rounded-lg text-14 font-medium flex items-center gap-8 p-20 text-white/60',
          )}
        >
          <input
            id="approve-warnings"
            type="checkbox"
            className="size-18 shrink-0"
            data-testid="approve-warnings"
          />
          I accept any applicable warning(s) and understand fee on transfer
          (tax) or rebasing tokens are not supported
        </label>

        {user && (
          <>
            {config.ui.showCart && (
              <Button
                className={style.addCart}
                type="button"
                variant="white"
                size="lg"
                disabled={loading || animating}
                onClick={addToCart}
                data-testid="add-strategy-to-cart"
              >
                Add to Cart
              </Button>
            )}
            <Button
              type="submit"
              variant="success"
              size="lg"
              loading={loading}
              loadingChildren={loadingChildren}
              data-testid="create-strategy"
            >
              Create
            </Button>
          </>
        )}
        {!user && (
          <Button
            type="button"
            variant="success"
            size="lg"
            loading={loading}
            loadingChildren={loadingChildren}
            onClick={openConnect}
          >
            Connect Wallet
          </Button>
        )}
      </footer>
    </form>
  );
};
