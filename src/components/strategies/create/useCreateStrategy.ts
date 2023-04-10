import { useMemo, useState } from 'react';
import { OrderCreate, useOrder } from './useOrder';
import { QueryKey, useCreateStrategyQuery } from 'libs/queries';
import { useModal } from 'hooks/useModal';
import { ModalTokenListData } from 'libs/modals/modals/ModalTokenList';
import { useApproval } from 'hooks/useApproval';
import { PathNames, useNavigate } from 'libs/routing';
import { Token } from 'libs/tokens';
import { config } from 'services/web3/config';
import { useGetTokenBalance, useQueryClient } from 'libs/queries';
import { useWeb3 } from 'libs/web3';
import { useNotifications } from 'hooks/useNotifications';
import { useDuplicateStrategy } from './useDuplicateStrategy';
import { carbonEvents } from 'services/googleTagManager';
import { useStrategyEventData } from './useStrategyEventData';

const spenderAddress = config.carbon.carbonController;

export const useCreateStrategy = () => {
  const { templateStrategy } = useDuplicateStrategy();
  const cache = useQueryClient();
  const navigate = useNavigate();
  const { user } = useWeb3();
  const { openModal } = useModal();
  const [base, setBase] = useState<Token | undefined>(templateStrategy?.base);
  const [quote, setQuote] = useState<Token | undefined>(
    templateStrategy?.quote
  );
  const { dispatchNotification } = useNotifications();

  const token0BalanceQuery = useGetTokenBalance(base);
  const token1BalanceQuery = useGetTokenBalance(quote);
  const order1 = useOrder(templateStrategy?.order1);
  const order0 = useOrder(templateStrategy?.order0);

  const mutation = useCreateStrategyQuery();

  const showOrders = !!base && !!quote;

  const approvalTokens = useMemo(() => {
    const arr = [];

    if (base) {
      arr.push({
        ...base,
        spender: spenderAddress,
        amount: order1.budget,
      });
    }
    if (quote) {
      arr.push({
        ...quote,
        spender: spenderAddress,
        amount: order0.budget,
      });
    }

    return arr;
  }, [base, quote, order0.budget, order1.budget]);

  const approval = useApproval(approvalTokens);
  const strategyEventData = useStrategyEventData({
    base,
    quote,
    order0,
    order1,
  });

  const create = async () => {
    if (!base || !quote || !user) {
      throw new Error('error in create strategy: missing data ');
    }

    mutation.mutate(
      {
        base: base,
        quote: quote,
        order0: {
          budget: order0.budget,
          min: order0.min,
          max: order0.max,
          price: order0.price,
        },
        order1: {
          budget: order1.budget,
          min: order1.min,
          max: order1.max,
          price: order1.price,
        },
      },
      {
        onSuccess: async (tx) => {
          dispatchNotification('createStrategy', { txHash: tx.hash });
          if (!tx) return;
          console.log('tx hash', tx.hash);
          await tx.wait();
          void cache.invalidateQueries({
            queryKey: QueryKey.balance(user, base.address),
          });
          void cache.invalidateQueries({
            queryKey: QueryKey.balance(user, quote.address),
          });
          navigate({ to: PathNames.strategies });
          console.log('tx confirmed');
          carbonEvents.strategy.strategyCreate(strategyEventData);
        },
        onError: (e) => {
          console.error('create mutation failed', e);
        },
      }
    );
  };

  const checkErrors = (
    order: OrderCreate,
    otherOrder: OrderCreate,
    balance?: string
  ) => {
    const minMaxCorrect =
      Number(order.min) > 0 && Number(order.max) > Number(order.min);
    const priceCorrect = Number(order.price) > 0;
    const budgetCorrect =
      !order.budget || Number(order.budget) <= Number(balance);

    return (minMaxCorrect || priceCorrect) && budgetCorrect;
  };

  const createStrategy = async () => {
    const sourceCorrect = checkErrors(order0, order1, token1BalanceQuery.data);
    const targetCorrect = checkErrors(order1, order0, token0BalanceQuery.data);

    if (sourceCorrect && targetCorrect) {
      if (approval.approvalRequired)
        openModal('txConfirm', {
          approvalTokens,
          onConfirm: create,
          buttonLabel: 'Create Strategy',
          eventData: {
            ...strategyEventData,
            token: approval.tokens.map(({ symbol }) => symbol),
          },
        });
      else create();
    }
  };

  const handleChangeTokensEvents = (isSource = false, token: Token) => {
    if (isSource) {
      !base
        ? carbonEvents.strategy.newStrategyBaseTokenSelect({
            token: token?.symbol,
          })
        : carbonEvents.strategy.strategyBaseTokenChange({
            token: token?.symbol,
          });
    } else {
      !quote
        ? carbonEvents.strategy.newStrategyQuoteTokenSelect({
            token: token?.symbol,
          })
        : carbonEvents.strategy.strategyQuoteTokenChange({
            token: token?.symbol,
          });
    }
  };

  const openTokenListModal = (isSource?: boolean) => {
    const onClick = (token: Token) => {
      handleChangeTokensEvents(isSource, token);
      if (isSource) {
        const b = token.address;
        const q = quote?.address;

        navigate({
          to: PathNames.createStrategy,
          search: { base: b, quote: q },
        });
      } else {
        const b = base?.address;
        const q = token.address;
        navigate({
          to: PathNames.createStrategy,
          search: { base: b, quote: q },
        });
      }
      order0.resetFields();
      order1.resetFields();
    };

    const data: ModalTokenListData = {
      onClick,
      excludedTokens: [isSource ? quote?.address ?? '' : base?.address ?? ''],
      isBaseToken: isSource,
    };
    openModal('tokenLists', data);
  };

  const isCTAdisabled = useMemo(() => {
    const isOrder0Valid = order0.isRange
      ? +order0.min > 0 && +order0.max > 0 && +order0.min < +order0.max
      : +order0.price > 0;

    const isOrder1Valid = order1.isRange
      ? +order1.min > 0 && +order1.max > 0 && +order1.min < +order1.max
      : +order1.price > 0;

    return (
      approval.isLoading ||
      approval.isError ||
      mutation.isLoading ||
      !isOrder0Valid ||
      !isOrder1Valid
    );
  }, [
    approval.isError,
    approval.isLoading,
    mutation.isLoading,
    order0,
    order1,
  ]);

  return {
    base,
    setBase,
    quote,
    setQuote,
    order0,
    order1,
    createStrategy,
    openTokenListModal,
    showOrders,
    isCTAdisabled,
    token0BalanceQuery,
    token1BalanceQuery,
  };
};
