import { FC, FormEvent, ReactNode, useState } from 'react';
import { EditPriceNav } from './EditPriceNav';
import { EditTypes } from 'libs/routing/routes/strategyEdit';
import { EditStrategyOverlapTokens } from './EditStrategyOverlapTokens';
import { Button } from 'components/common/button';
import { useNavigate, useRouter, useSearch } from '@tanstack/react-router';
import { cn } from 'utils/helpers';
import { QueryKey, useQueryClient, useUpdateStrategyQuery } from 'libs/queries';
import { FormStaticOrder, StaticOrder, Strategy } from '../common/types';
import { getStatusTextByTxStatus } from '../utils';
import { isZero } from '../common/utils';
import { handleTxStatusAndRedirectToOverview } from '../create/utils';
import { useModal } from 'hooks/useModal';
import { useNotifications } from 'hooks/useNotifications';
import { NotificationSchema } from 'libs/notifications/data';
import { StrategyType } from 'libs/routing';
import { useWagmi } from 'libs/wagmi';
import { getDeposit } from './utils';
import { useApproval } from 'hooks/useApproval';
import { useEditStrategyCtx } from './EditStrategyContext';
import { useDeleteStrategy } from '../useDeleteStrategy';
import { hasNoBudget } from '../overlapping/utils';
import { StrategyUpdate } from '@bancor/carbon-sdk';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { InitMarketPrice } from '../common/InitMarketPrice';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import style from 'components/strategies/common/form.module.css';
import config from 'config';

interface EditOrders {
  buy: FormStaticOrder;
  sell: FormStaticOrder;
}

interface Props {
  orders: EditOrders;
  strategyType: StrategyType;
  editType: EditTypes;
  hasChanged: boolean;
  children: ReactNode;
  approveText?: string;
}

const notifKey: Record<EditTypes, keyof NotificationSchema> = {
  deposit: 'depositStrategy',
  withdraw: 'withdrawStrategy',
  editPrices: 'changeRatesStrategy',
  renew: 'renewStrategy',
};

const submitText: Record<EditTypes, string> = {
  renew: 'Renew Strategy',
  editPrices: 'Confirm Changes',
  deposit: 'Confirm Deposit',
  withdraw: 'Confirm Withdraw',
};

const spenderAddress = config.addresses.carbon.carbonController;

const getFieldsToUpdate = (
  orders: EditOrders,
  strategy: Strategy<StaticOrder>,
) => {
  const fieldsToUpdate: Partial<StrategyUpdate> = {};
  if (orders.buy.min !== strategy.buy.min) {
    fieldsToUpdate.buyPriceLow = orders.buy.min;
  }
  if (orders.buy.max !== strategy.buy.max) {
    fieldsToUpdate.buyPriceHigh = orders.buy.max;
  }
  if (orders.buy.budget !== strategy.buy.budget) {
    fieldsToUpdate.buyBudget = orders.buy.budget;
  }
  if (orders.sell.min !== strategy.sell.min) {
    fieldsToUpdate.sellPriceLow = orders.sell.min;
  }
  if (orders.sell.max !== strategy.sell.max) {
    fieldsToUpdate.sellPriceHigh = orders.sell.max;
  }
  if (orders.sell.budget !== strategy.sell.budget) {
    fieldsToUpdate.sellBudget = orders.sell.budget;
  }
  return fieldsToUpdate as StrategyUpdate;
};

export const EditPricesForm: FC<Props> = (props) => {
  const {
    orders,
    strategyType,
    editType,
    hasChanged,
    children,
    approveText = "I've reviewed the warning(s) but choose to proceed.",
  } = props;
  const { user } = useWagmi();
  const { strategy } = useEditStrategyCtx();
  const { history } = useRouter();
  const { isProcessing: isDeleting, deleteStrategy } = useDeleteStrategy();
  const search = useSearch({ from: '/strategies/edit/$strategyId/prices' });
  const navigate = useNavigate({ from: '/strategies/edit/$strategyId/prices' });

  const { openModal } = useModal();
  const { dispatchNotification } = useNotifications();

  const updateMutation = useUpdateStrategyQuery(strategy);
  const cache = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const isPending = updateMutation.isPending;

  const { base, quote } = strategy;
  const marketQuery = useMarketPrice({ base, quote });
  const marketPrice = search.marketPrice ?? marketQuery.marketPrice?.toString();

  const approvalTokens = (() => {
    const arr = [];
    const buyDeposit = getDeposit(strategy.buy.budget, orders.buy.budget);
    if (!isZero(buyDeposit)) {
      arr.push({
        ...strategy.quote,
        spender: spenderAddress,
        amount: buyDeposit,
      });
    }
    const sellDeposit = getDeposit(strategy.sell.budget, orders.sell.budget);
    if (!isZero(sellDeposit)) {
      arr.push({
        ...strategy.base,
        spender: spenderAddress,
        amount: sellDeposit,
      });
    }
    return arr;
  })();
  const approval = useApproval(approvalTokens);
  const isLoading =
    (approval.isPending && !!user) || isPending || isProcessing || isDeleting;
  const loadingChildren = getStatusTextByTxStatus(
    isPending,
    isProcessing || isDeleting,
  );

  const isDisabled = (form: HTMLFormElement) => {
    if (!form.checkValidity()) return true;
    if (form.querySelector('.loading-message')) return true;
    if (form.querySelector('.error-message')) return true;
    const warnings = form.querySelector('.warning-message');
    if (!warnings) return false;
    return !form.querySelector<HTMLInputElement>('#approve-warnings')?.checked;
  };

  const update = () => {
    const fieldsToUpdate = getFieldsToUpdate(orders, strategy);
    updateMutation.mutate(orders, {
      onSuccess: async (tx) => {
        handleTxStatusAndRedirectToOverview(setIsProcessing, navigate);
        dispatchNotification(notifKey[editType], { txHash: tx.hash });
        if (!tx) return;
        console.log('tx hash', tx.hash);
        await tx.wait();
        cache.invalidateQueries({
          queryKey: QueryKey.strategiesByUser(user),
        });
        if (fieldsToUpdate.sellBudget) {
          cache.invalidateQueries({
            queryKey: QueryKey.balance(user!, strategy.base.address),
          });
        }
        if (fieldsToUpdate.buyBudget) {
          cache.invalidateQueries({
            queryKey: QueryKey.balance(user!, strategy.quote.address),
          });
        }
        console.log('tx confirmed');
      },
      onError: (e) => {
        setIsProcessing(false);
        console.error('update mutation failed', e);
      },
    });
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDisabled(e.currentTarget)) return;
    if (
      !hasNoBudget(strategy) &&
      isZero(orders.buy.budget) &&
      isZero(orders.sell.budget)
    ) {
      return openModal('withdrawOrDelete', {
        onWithdraw: update,
        onDelete: () => deleteStrategy(strategy),
      });
    }

    if (approval.approvalRequired) {
      return openModal('txConfirm', {
        approvalTokens,
        onConfirm: update,
        buttonLabel: 'Confirm Deposit',
      });
    }
    return update();
  };

  if (!marketPrice && marketQuery.isPending) {
    return <CarbonLogoLoading className="h-[80px] place-self-center" />;
  }

  if (!marketPrice) {
    return (
      <article
        key="marketPrice"
        className="bg-background-900 grid content-start rounded-2xl"
      >
        <EditStrategyOverlapTokens />
        <EditPriceNav editType={editType} />
        <InitMarketPrice base={base} quote={quote} />
      </article>
    );
  }

  return (
    <form
      onSubmit={submit}
      onReset={() => history.back()}
      className={cn(
        'grid content-start',
        style.form,
        strategyType === 'overlapping' ? style.overlapping : '',
      )}
      data-testid="edit-form"
    >
      <EditStrategyOverlapTokens />
      <EditPriceNav editType={editType} />

      <div className="overflow-hidden rounded-ee-2xl rounded-es-2xl">
        {children}
      </div>
      <footer className="mt-16 grid gap-16">
        <label
          htmlFor="approve-warnings"
          className={cn(
            style.approveWarnings,
            'rounded-lg bg-background-900 text-14 font-medium flex items-center gap-8 p-20 text-white/60',
          )}
        >
          <input
            id="approve-warnings"
            type="checkbox"
            name="approval"
            className="size-18"
            data-testid="approve-warnings"
          />
          {approveText}
        </label>
        <Button
          type="submit"
          disabled={!hasChanged}
          loading={isLoading}
          loadingChildren={loadingChildren}
          variant="success"
          size="lg"
          fullWidth
          data-testid="edit-submit"
        >
          {submitText[editType]}
        </Button>
        <Button
          type="reset"
          disabled={isLoading}
          variant="secondary"
          size="lg"
          fullWidth
        >
          Cancel
        </Button>
      </footer>
    </form>
  );
};
