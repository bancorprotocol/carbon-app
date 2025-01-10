import { FC, FormEvent, MouseEvent, ReactNode, useEffect } from 'react';
import { Token } from 'libs/tokens';
import { createStrategyEvents } from 'services/events/strategyEvents';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Button } from 'components/common/button';
import { toCreateStrategyParams, useCreateStrategy } from './useCreateStrategy';
import { getStatusTextByTxStatus } from '../utils';
import { useModal } from 'hooks/useModal';
import { cn } from 'utils/helpers';
import { useWagmi } from 'libs/wagmi';
import { BaseOrder } from 'components/strategies/common/types';
import { StrategyType } from 'libs/routing';
import { lsService } from 'services/localeStorage';
import style from 'components/strategies/common/form.module.css';

interface FormProps {
  type: StrategyType;
  base: Token;
  quote: Token;
  order0: BaseOrder;
  order1: BaseOrder;
  approvalText?: string;
  children: ReactNode;
}

export const CreateForm: FC<FormProps> = (props) => {
  const { base, quote, order0, order1, type, children } = props;
  const { openModal } = useModal();
  const { user } = useWagmi();
  const search = useSearch({ strict: false }) as any;
  const nav = useNavigate();

  const { isLoading, isProcessing, isAwaiting, createStrategy } =
    useCreateStrategy({ type, base, quote, order0, order1 });

  useEffect(() => {
    const timeout = setTimeout(() => {
      createStrategyEvents.change(type, search);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [type, search]);

  const loading = isLoading || isProcessing || isAwaiting;
  const loadingChildren = getStatusTextByTxStatus(isAwaiting, isProcessing);

  const connectWallet = () => {
    openModal('wallet', undefined);
  };

  const isDisabled = (form: HTMLFormElement) => {
    if (!form.checkValidity()) return true;
    if (!!form.querySelector('.loading-message')) return true;
    if (!!form.querySelector('.error-message')) return true;
    const warnings = form.querySelector('.warning-message');
    if (!warnings) return false;
    return !form.querySelector<HTMLInputElement>('#approve-warnings')?.checked;
  };

  const addToCart = (e: MouseEvent<HTMLButtonElement>) => {
    const form = e.currentTarget.form!;
    if (!form.checkValidity()) return;
    if (!!form.querySelector('.loading-message')) return;
    if (!!form.querySelector('.error-message')) return;
    const current = lsService.getItem('cart') ?? [];
    const next = [
      ...current,
      toCreateStrategyParams(base, quote, order0, order1),
    ];
    lsService.setItem('cart', next);
    // Dispatch event to cart
    const event = new CustomEvent('storage:cart', { detail: next });
    document.dispatchEvent(event);
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
    createStrategyEvents.submit(type, search);
    createStrategy();
  };

  return (
    <form
      onSubmit={create}
      className={cn(style.form, 'flex flex-1 flex-col gap-20')}
      data-testid="create-strategy-form"
    >
      {children}
      <label
        htmlFor="approve-warnings"
        className={cn(
          style.approveWarnings,
          'rounded-10 bg-background-900 text-14 font-weight-500 flex items-center gap-8 p-20 text-white/60'
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

      <Button
        className={cn(style.addCart, 'shrink-0')}
        type="button"
        variant="white"
        size="lg"
        fullWidth
        loading={loading}
        loadingChildren={loadingChildren}
        onClick={addToCart}
        data-testid="add-strategy-to-cart"
      >
        Add to cart
      </Button>

      {user ? (
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
          Create Strategy
        </Button>
      ) : (
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
    </form>
  );
};
