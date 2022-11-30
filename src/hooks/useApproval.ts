import {
  GetUserApprovalProps,
  useGetUserApproval,
} from 'queries/chain/approval';
import { useMemo } from 'react';

export type ApprovalToken = GetUserApprovalProps & {
  amount: string;
  symbol: string;
};

export type ApprovalTokenResult = ApprovalToken & {
  allowance: string;
  approvalRequired: boolean;
};

export const useApproval = (data: ApprovalToken[]) => {
  const approvalQuery = useGetUserApproval(data);

  const result = useMemo(() => {
    return approvalQuery.map((q, i) => {
      const newData: ApprovalTokenResult | undefined = q.data && {
        ...data[i],
        allowance: q.data.toString(),
        approvalRequired: q.data.lt(data[i].amount),
      };
      return {
        ...q,
        data: newData,
      };
    });
  }, [approvalQuery, data]);

  const approvalRequired = result.some((x) => x.data?.approvalRequired);

  return { approvalQuery: result, approvalRequired };
};
