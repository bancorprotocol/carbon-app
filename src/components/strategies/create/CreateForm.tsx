import { FC, FormEvent, ReactNode, useEffect } from 'react';
import { Token } from 'libs/tokens';
import { createStrategyEvents } from 'services/events/strategyEvents';
import { useSearch } from '@tanstack/react-router';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { Button } from 'components/common/button';
import { useCreateStrategy } from './useCreateStrategy';
import { getStatusTextByTxStatus } from '../utils';
import { useModal } from 'hooks/useModal';
import { cn } from 'utils/helpers';
import { m } from 'libs/motion';
import { items } from 'components/strategies/common/variants';
import { useWagmi } from 'libs/wagmi';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { BaseOrder } from 'components/strategies/common/types';
import { StrategyType } from 'libs/routing';
import style from 'components/strategies/common/form.module.css';

const title: Record<StrategyType, string> = {
  disposable: 'Disposable',
  recurring: 'Recurring',
  overlapping: 'Concentrated Liquidity',
};

interface HeaderProps {
  type: StrategyType;
  base: Token;
  quote: Token;
}
export const CreateFormHeader = (props: HeaderProps) => {
  const { base, quote, type } = props;
  return (
    <m.header
      variants={items}
      key="createStrategyBuyTokens"
      className="rounded-10 bg-background-900 flex flex-col gap-10 p-20"
    >
      <div className="flex gap-10">
        <TokensOverlap tokens={[base, quote]} size={32} />
        <hgroup>
          <h2 className="text-14 flex gap-6">
            <span>{base?.symbol}</span>
            <span role="separator" className="text-white/60">
              /
            </span>
            <span>{quote?.symbol}</span>
          </h2>
          <p className="text-14 capitalize text-white/60">{title[type]}</p>
        </hgroup>
      </div>
      <p className="text-12 font-weight-400 flex items-center text-white/60">
        <IconWarning className="ml-6 mr-10 w-14 flex-shrink-0" />
        Rebasing and fee-on-transfer tokens are not supported
      </p>
    </m.header>
  );
};

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

  const { isProcessing, isAwaiting, createStrategy } = useCreateStrategy({
    type,
    base,
    quote,
    order0,
    order1,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      createStrategyEvents.change(type, search);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [type, search]);

  const loading = isProcessing || isAwaiting;
  const loadingChildren = getStatusTextByTxStatus(isAwaiting, isProcessing);

  const connectWallet = () => {
    createStrategyEvents.connectWallet(type, search);
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
      className={cn(style.form, 'flex flex-col gap-20 md:w-[440px]')}
      data-testid="create-strategy-form"
    >
      <CreateFormHeader type={type} base={base} quote={quote} />
      {children}
      <m.label
        htmlFor="approve-warnings"
        variants={items}
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
      </m.label>

      <m.div variants={items} key="createStrategyCTA">
        {user ? (
          <Button
            type="submit"
            variant="success"
            size="lg"
            fullWidth
            loading={loading}
            loadingChildren={loadingChildren}
          >
            Create Strategy
          </Button>
        ) : (
          <Button
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
      </m.div>
    </form>
  );
};
