import {
  GetUserApprovalProps,
  useGetUserApproval,
} from 'libs/queries/chain/approval';
import { useMemo } from 'react';

export type ApprovalToken = GetUserApprovalProps & {
  amount: string;
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

  const approvalRequired = useMemo(
    () => result.some((x) => x.data?.approvalRequired),
    [result]
  );

  const isLoading = useMemo(() => result.some((x) => x.isLoading), [result]);
  const isError = useMemo(() => result.some((x) => x.isError), [result]);
  const error = useMemo(() => result.find((x) => x.isError)?.error, [result]);

  return { approvalQuery: result, approvalRequired, isLoading, isError, error };
};
