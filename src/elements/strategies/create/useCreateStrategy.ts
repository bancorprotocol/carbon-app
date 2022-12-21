import { Order, useOrder } from './useOrder';
import { useCreateStrategy } from 'queries';
import { useMemo, useState } from 'react';
import { useModal } from 'modals';
import { ModalTokenListData } from 'modals/modals/ModalTokenList/ModalTokenList';
import poolCollectionProxyAbi from 'abis/PoolCollection_Proxy.json';
import { ApprovalToken, useApproval } from 'hooks/useApproval';
import { PathNames, useNavigate } from 'routing';
import { Token } from 'tokens';

const spenderAddress = poolCollectionProxyAbi.address;

export const useCreate = () => {
  const navigate = useNavigate();
  const { openModal } = useModal();
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
        logoURI: source.token.logoURI,
        symbol: source.token.symbol,
      });
    }
    if (target.token) {
      array.push({
        tokenAddress: target.token?.address,
        spenderAddress,
        amount: target.budget,
        decimals: target.token?.decimals,
        symbol: target.token.symbol,
      });
    }

    return array;
  }, [source.budget, source.token, target.budget, target.token]);

  const approval = useApproval(approvalTokens);

  const resetFields = () => {
    source.setMin('');
    source.setMax('');
    source.setPrice('');
    source.setBudget('');
    target.setMin('');
    target.setMax('');
    target.setPrice('');
    target.setBudget('');
  };

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
          if (source.budget && Number(source.budget) !== 0)
            source.balanceQuery.refetch();
          if (target.budget && Number(target.budget) !== 0)
            target.balanceQuery.refetch();
          navigate({ to: PathNames.strategies });
          console.log('tx confirmed');
        },
        onError: (e) => {
          console.error('create mutation failed', e);
        },
      }
    );
  };

  const checkErrors = (order: Order, otherOrder: Order) => {
    const minMaxCorrect =
      Number(order.min) > 0 && Number(order.max) > Number(order.min);
    const priceCorrect = Number(order.price) > 0;
    const budgetCorrect =
      !order.budget ||
      Number(order.budget) <= Number(otherOrder.balanceQuery.data);

    return (minMaxCorrect || priceCorrect) && budgetCorrect;
  };

  const onCTAClick = async () => {
    const sourceCorrect = checkErrors(source, target);
    const targetCorrect = checkErrors(target, source);

    if (sourceCorrect && targetCorrect) {
      if (approval.approvalRequired)
        openModal('txConfirm', { approvalTokens, onConfirm: create });
      else create();
    }
  };

  const openTokenListModal = (isSource?: boolean) => {
    const onClick = (token: Token) => {
      isSource ? source.setToken(token) : target.setToken(token);
      resetFields();
    };

    const data: ModalTokenListData = {
      onClick,
      excludedTokens: [
        isSource ? target.token?.address ?? '' : source.token?.address ?? '',
      ],
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
