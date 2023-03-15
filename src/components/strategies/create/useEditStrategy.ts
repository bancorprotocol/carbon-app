import { useMemo } from 'react';
import { OrderCreate } from './useOrder';
import { Strategy } from 'libs/queries';
import { useApproval } from 'hooks/useApproval';
import { config } from 'services/web3/config';

const spenderAddress = config.carbon.carbonController;

export const useEditStrategy = (
  strategy: Strategy,
  order0: OrderCreate,
  order1: OrderCreate
) => {
  const { token0, token1 } = strategy;

  const approvalTokens = useMemo(() => {
    return [
      ...(!!token0
        ? [
            {
              ...token0,
              spender: spenderAddress,
              amount: order1.budget,
            },
          ]
        : []),
      ...(!!token1
        ? [
            {
              ...token1,
              spender: spenderAddress,
              amount: order0.budget,
            },
          ]
        : []),
    ];
  }, [order0.budget, order1.budget, token0, token1]);

  const approval = useApproval(approvalTokens);

  return {
    approval,
  };
};
