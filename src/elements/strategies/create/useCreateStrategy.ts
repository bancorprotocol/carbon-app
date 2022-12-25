import { OrderCreate, useOrder } from './useOrder';
import { QueryKey, useCreateStrategy } from 'queries';
import { useMemo, useState } from 'react';
import { useModal } from 'modals';
import { ModalTokenListData } from 'modals/modals/ModalTokenList';
import { ApprovalToken, useApproval } from 'hooks/useApproval';
import { PathNames, useNavigate } from 'routing';
import { Token } from 'tokens';
import { config } from 'services/web3/config';
import { useGetTokenBalance, useQueryClient } from 'queries';
import { useWeb3 } from 'web3';

const spenderAddress = config.carbon.poolCollection;

export const useCreate = () => {
  const cache = useQueryClient();
  const navigate = useNavigate();
  const { user } = useWeb3();
  const { openModal } = useModal();
  const [token0, setToken0] = useState<Token | undefined>();
  const [token1, setToken1] = useState<Token | undefined>();

  const token0BalanceQuery = useGetTokenBalance(token0);
  const token1BalanceQuery = useGetTokenBalance(token1);

  const order0 = useOrder();
  const order1 = useOrder();
  const [name, setName] = useState('');
  const mutation = useCreateStrategy();

  const showStep2 = !!token0 && !!token1;

  const approvalTokens = useMemo(() => {
    const array: ApprovalToken[] = [];
    if (token0) {
      array.push({
        tokenAddress: token0.address,
        spenderAddress,
        amount: order0.budget,
        decimals: token0.decimals,
        logoURI: token0.logoURI,
        symbol: token0.symbol,
      });
    }
    if (token1) {
      array.push({
        tokenAddress: token1.address,
        spenderAddress,
        amount: order1.budget,
        decimals: token1.decimals,
        symbol: token1.symbol,
      });
    }

    return array;
  }, [order0.budget, token0, order1.budget, token1]);

  const approval = useApproval(approvalTokens);

  const create = async () => {
    if (!token0 || !token1 || !user) {
      throw new Error('error in create strategy: missing data ');
    }

    mutation.mutate(
      {
        token0: token0,
        token1: token1,
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
          console.log('tx hash', tx.hash);
          await tx.wait();
          void cache.invalidateQueries({
            queryKey: QueryKey.balance(user, token0.address),
          });
          void cache.invalidateQueries({
            queryKey: QueryKey.balance(user, token1.address),
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
        openModal('txConfirm', { approvalTokens, onConfirm: create });
      else create();
    }
  };

  const openTokenListModal = (isSource?: boolean) => {
    const onClick = (token: Token) => {
      isSource ? setToken0(token) : setToken1(token);
      order0.resetFields();
      order1.resetFields();
    };

    const data: ModalTokenListData = {
      onClick,
      excludedTokens: [
        isSource ? token1?.address ?? '' : token0?.address ?? '',
      ],
    };
    openModal('tokenLists', data);
  };

  const isCTAdisabled = useMemo(() => {
    return approval.isLoading || approval.isError || mutation.isLoading;
  }, [approval.isError, approval.isLoading, mutation.isLoading]);

  return {
    token0,
    setToken0,
    token1,
    setToken1,
    order0,
    order1,
    name,
    setName,
    createStrategy,
    openTokenListModal,
    showStep2,
    isCTAdisabled,
    token0BalanceQuery,
    token1BalanceQuery,
  };
};
