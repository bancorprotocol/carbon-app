import { useMemo } from 'react';
import { Strategy } from 'libs/queries';
import { useApproval } from 'hooks/useApproval';
import { config } from 'services/web3/config';

const spenderAddress = config.carbon.carbonController;

export const useEditStrategy = (
  strategy: Strategy,
  buyDeposit: string,
  sellDeposit: string
) => {
  const { base, quote } = strategy;

  const approvalTokens = useMemo(() => {
    return [
      ...(!!base
        ? [
            {
              ...base,
              spender: spenderAddress,
              amount: sellDeposit,
            },
          ]
        : []),
      ...(!!quote
        ? [
            {
              ...quote,
              spender: spenderAddress,
              amount: buyDeposit,
            },
          ]
        : []),
    ];
  }, [buyDeposit, sellDeposit, base, quote]);

  const approval = useApproval(approvalTokens);

  return {
    approval,
  };
};
