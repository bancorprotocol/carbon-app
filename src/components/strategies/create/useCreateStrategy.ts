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
import { sendEvent } from 'services/googleTagManager';

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
    return [
      ...(!!base
        ? [
            {
              ...base,
              spender: spenderAddress,
              amount: order1.budget,
            },
          ]
        : []),
      ...(!!quote
        ? [
            {
              ...quote,
              spender: spenderAddress,
              amount: order0.budget,
            },
          ]
        : []),
    ];
  }, [base, quote, order0.budget, order1.budget]);

  const approval = useApproval(approvalTokens);

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
        });
      else create();
    }
  };

  const handleChangeTokensEvents = (isSource = false, token: Token) => {
    isSource
      ? sendEvent(
          'strategy',
          !base
            ? 'new_strategy_base_token_select'
            : 'strategy_base_token_change',
          {
            token: token?.symbol,
          }
        )
      : sendEvent(
          'strategy',
          !quote
            ? 'new_strategy_quote_token_select'
            : 'strategy_quote_token_change',
          {
            token: token.symbol,
          }
        );
  };

  const openTokenListModal = (isSource?: boolean) => {
    const onClick = (token: Token) => {
      isSource ? setBase(token) : setQuote(token);
      handleChangeTokensEvents(isSource, token);
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
