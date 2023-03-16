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
  const { base, quote } = strategy;

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
  }, [order0.budget, order1.budget, base, quote]);

  const approval = useApproval(approvalTokens);

  return {
    approval,
  };
};
