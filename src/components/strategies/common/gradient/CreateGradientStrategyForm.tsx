import { FC, FormEvent, MouseEvent, ReactNode, useState } from 'react';
import { useNavigate } from 'libs/routing';
import { Button } from 'components/common/button';
import { useModal } from 'hooks/useModal';
import { cn } from 'utils/helpers';
import { useWagmi } from 'libs/wagmi';
import {
  addStrategyToCart,
  toGradientCartStorage,
} from 'components/cart/utils';
import style from 'components/strategies/common/form.module.css';
import config from 'config';
import { useTradeCtx } from 'components/trade/TradeContext';
import { FormGradientOrder } from '../types';

interface FormProps {
  buy: FormGradientOrder;
  sell: FormGradientOrder;
  children: ReactNode;
}

export const CreateGradientStrategyForm: FC<FormProps> = (props) => {
  const { base, quote } = useTradeCtx();
  const { children, buy, sell } = props;
  const { openModal } = useModal();
  const { user } = useWagmi();
  const nav = useNavigate();

  const [animating, setAnimating] = useState(false);
  const [loadingText, setLoadingText] = useState('');

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
    const params = toGradientCartStorage(base, quote, buy, sell);
    await addStrategyToCart(user, params);
    setAnimating(false);
    // Remove budget
    nav({
      to: '.',
      params: (params) => params,
      search: (s) => ({
        ...s,
        budget: undefined,
        sellBudget: undefined,
        buyBudget: undefined,
      }),
      replace: true,
      resetScroll: false,
    });
  };

  const create = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDisabled(e.currentTarget)) return;
    // await createStrategy({
    //   onSuccess: () => nav({ to: '/', search: {}, params: {} }),
    // });
  };

  return (
    <form
      onSubmit={create}
      className={cn(style.form, 'flex flex-1 flex-col gap-20')}
      data-testid="create-strategy-form"
    >
      {children}
      <div
        className={cn(
          style.approveWarnings,
          'rounded-10 bg-background-900 text-14 grid gap-16 p-20 text-white/60',
        )}
      >
        <p className="warning-message text-12 text-white/60">
          Please confirm before proceeding.
        </p>
        <label
          htmlFor="approve-warnings"
          className="font-weight-500 flex items-center gap-8"
        >
          <input
            id="approve-warnings"
            type="checkbox"
            className="size-18"
            data-testid="approve-warnings"
          />
          I've reviewed all strategy parameters.
        </label>
      </div>

      {user && (
        <>
          {config.ui.showCart && (
            <Button
              className={cn(style.addCart, 'shrink-0')}
              type="button"
              variant="white"
              size="lg"
              fullWidth
              disabled={!!loadingText || animating}
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
            loading={!!loadingText}
            loadingChildren={loadingText}
            data-testid="create-strategy"
          >
            Create Strategy
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
          loading={!!loadingText}
          loadingChildren={loadingText}
          onClick={connectWallet}
        >
          Connect Wallet
        </Button>
      )}
    </form>
  );
};
