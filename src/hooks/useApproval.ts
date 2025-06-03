import {
  GetUserApprovalProps,
  useGetUserApproval,
} from 'libs/queries/chain/approval';
import { useMemo } from 'react';
import { sanitizeNumber } from 'utils/helpers';
import { NULL_APPROVAL_CONTRACTS } from 'utils/approval';

export type ApprovalToken = GetUserApprovalProps & {
  amount: string;
};

export type ApprovalTokenResult = ApprovalToken & {
  allowance: string;
  approvalRequired: boolean;
  nullApprovalRequired: boolean;
  isNullApprovalToken: boolean;
};

export const useApproval = (data: ApprovalToken[]) => {
  const approvalQuery = useGetUserApproval(data);

  const result = useMemo(() => {
    return approvalQuery.map((q, i) => {
      const amount = sanitizeNumber(data[i].amount, data[i].decimals);
      const isNullApprovalToken = NULL_APPROVAL_CONTRACTS.includes(
        data[i].address.toLowerCase(),
      );
      const newData: ApprovalTokenResult | undefined = q.data && {
        ...data[i],
        allowance: q.data.toString(),
        approvalRequired: q.data.lt(amount),
        isNullApprovalToken,
        nullApprovalRequired:
          isNullApprovalToken && q.data.gt(0) && q.data.lt(amount),
      };
      return {
        ...q,
        data: newData,
      };
    });
  }, [approvalQuery, data]);

  const approvalRequired = useMemo(
    () => result.some((x) => x.data?.approvalRequired),
    [result],
  );

  const isPending = useMemo(() => result.some((x) => x.isPending), [result]);
  const isError = useMemo(() => result.some((x) => x.isError), [result]);
  const error = useMemo(() => result.find((x) => x.isError)?.error, [result]);

  return {
    approvalQuery: result,
    approvalRequired,
    isPending,
    isError,
    error,
    tokens: data,
  };
};
