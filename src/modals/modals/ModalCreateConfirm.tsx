import { Modal } from 'modals/Modal';
import { ModalFC } from 'modals/modals.types';
import { useGetUserApproval } from 'queries/chain/approval';
import { ApproveToken } from 'components/approval';
import { Button } from 'components/Button';
import { useModal } from 'modals/ModalProvider';
import { useMemo } from 'react';
import { ApprovalToken } from 'pages/debug';

export type ModalTxConfirmData = {
  approvalTokens: ApprovalToken[];
  onConfirm: Function;
};

export type ApprovalTokenResult = ApprovalToken & {
  allowance: string;
  approvalRequired: boolean;
};

const useApproval = (data: ApprovalToken[]) => {
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

export const ModalCreateConfirm: ModalFC<ModalTxConfirmData> = ({
  id,
  data: { approvalTokens, onConfirm },
}) => {
  const { closeModal } = useModal();
  const { approvalQuery, approvalRequired } = useApproval(approvalTokens);

  return (
    <Modal id={id} title={'Confirm Transaction'}>
      <h3 className={'mt-30 mb-20'}>1. Approval</h3>
      <div className={'space-y-20'}>
        {approvalQuery.map(({ data, isLoading, error }, i) => (
          <ApproveToken
            key={i}
            data={data}
            isLoading={isLoading}
            error={error}
          />
        ))}
      </div>
      <h3 className={'mt-30 mb-20'}>2. Create Strategy</h3>
      <Button
        size={'lg'}
        fullWidth
        disabled={approvalRequired}
        onClick={async () => {
          await onConfirm();
          closeModal(id);
        }}
      >
        Confirm Create Strategy
      </Button>
    </Modal>
  );
};
