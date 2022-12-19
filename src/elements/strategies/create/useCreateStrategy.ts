import { Order, useOrder } from './useOrder';
import { useCreateStrategy } from 'queries';
import { useMemo, useState } from 'react';
import { useModal } from 'modals';
import { ModalTokenListData } from 'modals/modals/ModalTokenList';
import poolCollectionProxyAbi from 'abis/PoolCollection_Proxy.json';
import { ApprovalToken, useApproval } from 'hooks/useApproval';
import { useTokens } from 'tokens';
import { PathNames, useNavigate } from 'routing';

const spenderAddress = poolCollectionProxyAbi.address;

export const useCreate = () => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { tokens } = useTokens();
  const source = useOrder();
  const target = useOrder();
  const [name, setName] = useState('');
  const mutation = useCreateStrategy();

  const showStep2 = !!source.token && !!target.token;

  const approvalTokens = useMemo(() => {
    const array: ApprovalToken[] = [];
    if (source.token) {
      array.push({
        tokenAddress: source.token?.address,
        spenderAddress,
        amount: source.budget,
        decimals: source.token?.decimals,
        token: source.token,
      });
    }
    if (target.token) {
      array.push({
        tokenAddress: target.token?.address,
        spenderAddress,
        amount: target.budget,
        decimals: target.token?.decimals,
        token: target.token,
      });
    }

    return array;
  }, [source.budget, source.token, target.budget, target.token]);

  const approval = useApproval(approvalTokens);

  const create = async () => {
    if (!(source && target)) {
      throw new Error('source or target tokens not set');
    }
    mutation.mutate(
      {
        token0: {
          balance: source.budget,
          token: source.token!,
          min: source.min,
          max: source.max,
          price: source.price,
        },
        token1: {
          balance: target.budget,
          token: target.token!,
          min: target.min,
          max: target.max,
          price: target.price,
        },
      },
      {
        onSuccess: async (tx) => {
          console.log('tx hash', tx.hash);
          await tx.wait();
          navigate({ to: PathNames.strategies });
          console.log('tx confirmed');
        },
        onError: (e) => {
          console.error('create mutation failed', e);
        },
      }
    );
  };

  const checkAndSetErrors = (order: Order) => {
    const minMaxCorrect =
      Number(order.min) > 0 && Number(order.max) > Number(order.min);
    const priceCorrect = Number(order.price) > 0;
    const budgetCorrect =
      Number(order.budget) <= Number(order.balanceQuery.data);

    if (!minMaxCorrect)
      order.setRangeError(
        'Max Price must be higher than min price and not zero'
      );

    if (!priceCorrect) order.setPriceError('Price Must be greater than 0');

    if (!budgetCorrect) order.setBudgetError('Insufficient Balance');

    return (priceCorrect || minMaxCorrect) && budgetCorrect;
  };

  const resetErrors = (order: Order) => {
    order.setRangeError('');
    order.setPriceError('');
    order.setBudgetError('');
  };

  const onCTAClick = async () => {
    resetErrors(source);
    resetErrors(target);

    const sourceCorrect = checkAndSetErrors(source);
    const targetCorrect = checkAndSetErrors(target);

    if (sourceCorrect && targetCorrect) {
      if (approval.approvalRequired)
        openModal('txConfirm', { approvalTokens, onConfirm: create });
      else create();
    }
  };

  const openTokenListModal = (type?: 'source' | 'target') => {
    const onClick =
      type === 'source'
        ? source.setToken
        : type === 'target'
        ? target.setToken
        : () => {};

    const data: ModalTokenListData = {
      onClick,
      tokens: tokens ?? [],
      limit: true,
    };
    openModal('tokenLists', data);
  };

  const isCTAdisabled = useMemo(() => {
    return approval.isLoading || approval.isError || mutation.isLoading;
  }, [approval.isError, approval.isLoading, mutation.isLoading]);

  return {
    source,
    target,
    name,
    setName,
    onCTAClick,
    openTokenListModal,
    showStep2,
    isCTAdisabled,
  };
};
