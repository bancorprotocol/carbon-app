import { FC, FormEvent, ReactNode, useState } from 'react';
import { EditPriceNav } from './EditPriceNav';
import { EditTypes } from 'libs/routing/routes/strategyEdit';
import { EditStrategyOverlapTokens } from './EditStrategyOverlapTokens';
import { Button } from 'components/common/button';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { cn } from 'utils/helpers';
import {
  QueryKey,
  Strategy,
  useQueryClient,
  useUpdateStrategyQuery,
} from 'libs/queries';
import { getStatusTextByTxStatus } from '../utils';
import { isZero } from '../common/utils';
import { carbonEvents } from 'services/events';
import { BaseOrder } from '../common/types';
import { handleTxStatusAndRedirectToOverview } from '../create/utils';
import { useModal } from 'hooks/useModal';
import { useNotifications } from 'hooks/useNotifications';
import { NotificationSchema } from 'libs/notifications/data';
import {
  toStrategyEventParams,
  useStrategyEvent,
} from '../create/useStrategyEventData';
import { StrategyType } from 'libs/routing';
import { useWagmi } from 'libs/wagmi';
import { getDeposit } from './utils';
import { useApproval } from 'hooks/useApproval';
import { useEditStrategyCtx } from './EditStrategyContext';
import { useDeleteStrategy } from '../useDeleteStrategy';
import style from 'components/strategies/common/form.module.css';
import config from 'config';
import { hasNoBudget } from '../overlapping/utils';
import { StrategyUpdate } from '@bancor/carbon-sdk';

interface EditOrders {
  buy: BaseOrder;
  sell: BaseOrder;
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

const getFieldsToUpdate = (orders: EditOrders, strategy: Strategy) => {
  const { buy, sell } = orders;
  const { order0, order1 } = strategy;
  const fieldsToUpdate: Partial<StrategyUpdate> = {};
  if (buy.min !== order0.startRate) fieldsToUpdate.buyPriceLow = buy.min;
  if (buy.max !== order0.endRate) fieldsToUpdate.buyPriceHigh = buy.max;
  if (buy.budget !== order0.balance) fieldsToUpdate.buyBudget = buy.budget;
  if (sell.min !== order1.startRate) fieldsToUpdate.sellPriceLow = sell.min;
  if (sell.max !== order1.endRate) fieldsToUpdate.sellPriceHigh = sell.max;
  if (sell.budget !== order1.balance) fieldsToUpdate.sellBudget = sell.budget;
  return fieldsToUpdate as StrategyUpdate;
};

export const EditStrategyForm: FC<Props> = (props) => {
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
  const navigate = useNavigate({ from: '/strategies/edit/$strategyId' });

  const strategyEventData = useStrategyEvent(
    toStrategyEventParams(strategy, strategyType)
  );

  const { openModal } = useModal();
  const { dispatchNotification } = useNotifications();

  const updateMutation = useUpdateStrategyQuery();
  const cache = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const isPending = updateMutation.isPending;

  const approvalTokens = (() => {
    const arr = [];
    const buyDeposit = getDeposit(strategy.order0.balance, orders.buy.budget);
    if (!isZero(buyDeposit)) {
      arr.push({
        ...strategy.quote,
        spender: spenderAddress,
        amount: buyDeposit,
      });
    }
    const sellDeposit = getDeposit(strategy.order1.balance, orders.sell.budget);
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
    isProcessing || isDeleting
  );

  const isDisabled = (form: HTMLFormElement) => {
    if (!form.checkValidity()) return true;
    if (!!form.querySelector('.loading-message')) return true;
    if (!!form.querySelector('.error-message')) return true;
    const warnings = form.querySelector('.warning-message');
    if (!warnings) return false;
    return !form.querySelector<HTMLInputElement>('#approve-warnings')?.checked;
  };

  const update = () => {
    updateMutation.mutate(
      {
        id: strategy.id,
        encoded: strategy.encoded,
        fieldsToUpdate: getFieldsToUpdate(orders, strategy),
        buyMarginalPrice: orders.buy.marginalPrice,
        sellMarginalPrice: orders.sell.marginalPrice,
      },
      {
        onSuccess: async (tx) => {
          handleTxStatusAndRedirectToOverview(setIsProcessing, navigate);
          dispatchNotification(notifKey[editType], { txHash: tx.hash });
          if (!tx) return;
          console.log('tx hash', tx.hash);
          await tx.wait();
          cache.invalidateQueries({
            queryKey: QueryKey.strategies(user),
          });
          carbonEvents.strategyEdit.strategyEditPrices({
            ...strategyEventData,
            strategyId: strategy.id,
          });
          console.log('tx confirmed');
        },
        onError: (e) => {
          setIsProcessing(false);
          console.error('update mutation failed', e);
        },
      }
    );
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
        onDelete: () =>
          deleteStrategy(strategy, () =>
            carbonEvents.strategyEdit.strategyDelete({
              strategyId: strategy.id,
              ...strategyEventData,
            })
          ),
      });
    }

    if (approval.approvalRequired) {
      return openModal('txConfirm', {
        approvalTokens,
        onConfirm: update,
        buttonLabel: 'Confirm Deposit',
        eventData: {
          ...strategyEventData,
          productType: 'strategy',
          approvalTokens,
          buyToken: strategy.base,
          sellToken: strategy.quote,
          blockchainNetwork: config.network.name,
        },
        context: 'depositStrategyFunds',
      });
    }
    return update();
  };

  return (
    <form
      onSubmit={submit}
      onReset={() => history.back()}
      className={cn('flex flex-col gap-20', style.form, {
        [style.overlapping]: strategyType === 'overlapping',
      })}
      data-testid="edit-form"
    >
      <EditStrategyOverlapTokens />
      <EditPriceNav editType={editType} />

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
        variant="white"
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
    </form>
  );
};
