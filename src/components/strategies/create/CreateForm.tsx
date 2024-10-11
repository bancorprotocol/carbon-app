import { FC, FormEvent, ReactNode, useEffect } from 'react';
import { Token } from 'libs/tokens';
import { createStrategyEvents } from 'services/events/strategyEvents';
import { useSearch } from '@tanstack/react-router';
import { Button } from 'components/common/button';
import { useCreateStrategy } from './useCreateStrategy';
import { getStatusTextByTxStatus } from '../utils';
import { useModal } from 'hooks/useModal';
import { cn } from 'utils/helpers';
import { useWagmi } from 'libs/wagmi';
import { BaseOrder } from 'components/strategies/common/types';
import { StrategyType } from 'libs/routing';
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
