import { Order, useOrder } from './useOrder';
import { useCreateStrategy } from 'queries';
import { useMemo, useState } from 'react';
import { useModal } from 'modals';
import { ModalTokenListData } from 'modals/modals/ModalTokenList';
import poolCollectionProxyAbi from 'abis/PoolCollection_Proxy.json';
import { ApprovalToken } from 'hooks/useApproval';
import { useTokens } from 'tokens';

const spenderAddress = poolCollectionProxyAbi.address;

export const useCreate = () => {
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

    if (!minMaxCorrect)
      order.setRangeError(
        'Max Price must be higher than min price and not zero'
      );

    if (!priceCorrect) order.setPriceError('Price Must be greater than 0');

    return priceCorrect || minMaxCorrect;
  };

  const onCTAClick = async () => {
    const sourceCorrect = checkAndSetErrors(source);
    const targetCorrect = checkAndSetErrors(target);

    if (sourceCorrect && targetCorrect)
      openModal('txConfirm', { approvalTokens, onConfirm: create });
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

  return {
    source,
    target,
    name,
    setName,
    onCTAClick,
    openTokenListModal,
    showStep2,
  };
};
