import { FC, FormEvent, MouseEvent, ReactNode, useState } from 'react';
import { Token } from 'libs/tokens';
import { useNavigate } from 'libs/routing';
import { Button } from 'components/common/button';
import { toCreateStrategyParams, useCreateStrategy } from './useCreateStrategy';
import { getStatusTextByTxStatus } from '../utils';
import { useModal } from 'hooks/useModal';
import { cn } from 'utils/helpers';
import { useWagmi } from 'libs/wagmi';
import { BaseOrder } from 'components/strategies/common/types';
import { addStrategyToCart } from 'components/cart/utils';
import style from 'components/strategies/common/form.module.css';
import config from 'config';

interface FormProps {
  base: Token;
  quote: Token;
  order0: BaseOrder;
  order1: BaseOrder;
  approvalText?: string;
  children: ReactNode;
}

export const CreateForm: FC<FormProps> = (props) => {
  const { base, quote, order0, order1, children } = props;
  const { openModal } = useModal();
  const { user } = useWagmi();
  const nav = useNavigate();

  const [animating, setAnimating] = useState(false);

  const { isLoading, isProcessing, isAwaiting, createStrategy } =
    useCreateStrategy({ base, quote, order0, order1 });

  const loading = isLoading || isProcessing || isAwaiting;
  const loadingChildren = getStatusTextByTxStatus(isAwaiting, isProcessing);

  const connectWallet = () => {
    openModal('wallet', undefined);
  };

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
    const params = toCreateStrategyParams(base, quote, order0, order1);
    await addStrategyToCart(user, params);
    setAnimating(false);
    // Remove budget
    nav({
      to: '.',
      search: (s) => {
        delete s.budget;
        delete s.buyBudget;
        delete s.sellBudget;
        return s;
      },
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
      className={cn(style.form, 'grid')}
      data-testid="create-strategy-form"
    >
      <div className="overflow-hidden rounded-ee rounded-es">{children}</div>
      <footer className="mt-16 grid gap-16">
        <label
          htmlFor="approve-warnings"
          className={cn(
            style.approveWarnings,
            'rounded-10 bg-background-900 text-14 font-weight-500 flex items-center gap-8 p-20 text-white/60',
          )}
        >
          <input
            id="approve-warnings"
            type="checkbox"
            className="size-18"
            data-testid="approve-warnings"
          />
          {props.approvalText ??
            "I've reviewed the warning(s) but choose to proceed."}
        </label>

        {user && (
          <>
            {config.ui.showCart && (
              <Button
                className={cn(style.addCart, 'shrink-0')}
                type="button"
                variant="white"
                size="lg"
                fullWidth
                disabled={loading || animating}
                onClick={addToCart}
                data-testid="add-strategy-to-cart"
              >
                Add to Cart
              </Button>
            )}
            <Button
              className="shrink-0"
              type="submit"
              variant="success"
              size="lg"
              fullWidth
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
            className="shrink-0"
            type="button"
            variant="success"
            size="lg"
            fullWidth
            loading={loading}
            loadingChildren={loadingChildren}
            onClick={connectWallet}
          >
            Connect Wallet
          </Button>
        )}
      </footer>
    </form>
  );
};
