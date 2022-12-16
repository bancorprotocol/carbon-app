import { useOrder } from './useOrder';
import { useCreateStrategy } from 'queries';
import { useMemo } from 'react';
import { useModal } from 'modals';
import { ModalTokenListData } from 'modals/modals/ModalTokenList';
import poolCollectionProxyAbi from 'abis/PoolCollection_Proxy.json';
import { ApprovalToken } from 'hooks/useApproval';
import { useTokens } from 'tokens';
import { useNavigate } from '@tanstack/react-location';
import { PathNames } from 'routing';
import { txWait } from 'utils/tenderly';

const spenderAddress = poolCollectionProxyAbi.address;

export const useCreate = () => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { tokens } = useTokens();
  const source = useOrder();
  const target = useOrder();
  const mutation = useCreateStrategy();

  const showStep2 = !!source.token && !!target.token;

  const approvalTokens = useMemo(() => {
    const array: ApprovalToken[] = [];
    if (source.token) {
      array.push({
        tokenAddress: source.token?.address,
        spenderAddress,
        amount: source.liquidity,
        decimals: source.token?.decimals,
        symbol: source.token?.symbol,
      });
    }
    if (target.token) {
      array.push({
        tokenAddress: target.token?.address,
        spenderAddress,
        amount: target.liquidity,
        decimals: target.token?.decimals,
        symbol: target.token?.symbol,
      });
    }

    return array;
  }, [source.liquidity, source.token, target.liquidity, target.token]);

  const create = async () => {
    if (!(source && target)) {
      throw new Error('source or target tokens not set');
    }
    mutation.mutate(
      {
        token0: {
          balance: source.liquidity,
          token: source.token!,
          low: source.low,
          high: source.high,
        },
        token1: {
          balance: target.liquidity,
          token: target.token!,
          low: target.low,
          high: target.high,
        },
      },
      {
        onSuccess: async (tx) => {
          console.log('tx hash', tx.hash);
          await txWait(tx);
          navigate({ to: PathNames.strategies });
          console.log('tx confirmed');
        },
        onError: (e) => {
          console.error('create mutation failed', e);
        },
      }
    );
  };

  const onCTAClick = async () => {
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
    onCTAClick,
    openTokenListModal,
    showStep2,
  };
};
