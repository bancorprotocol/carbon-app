import { Modal } from 'modals/Modal';
import { ModalFC } from 'modals/modals.types';
import {
  GetUserApprovalProps,
  useGetUserApproval,
} from 'queries/chain/approval';
import { ApproveToken } from 'components/approval';
import { Button } from 'components/Button';
import { useModal } from 'modals/ModalProvider';

export type ModalTxConfirmData = GetUserApprovalProps[];

export const ModalTxConfirm: ModalFC<ModalTxConfirmData> = ({ id, data }) => {
  const { closeModal } = useModal();
  const approvalQuery = useGetUserApproval(data);

  const hasApproval = !approvalQuery
    .map((q) => q.data && q.data.hasApproval)
    .some((x) => !x);

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
      <div className={'bg-content mb-30 space-y-10 rounded px-20 py-12'}>
        <div className={'text-secondary flex justify-between'}>
          <div>Buy</div>
          <div>Sell</div>
        </div>
        <div className={'flex justify-between'}>
          <div className={'flex items-center space-x-10'}>
            <div className={'bg-secondary h-30 w-30 rounded-full'} />
            <div className={'font-18 font-medium'}>USDT</div>
          </div>
          <div className={'flex items-center space-x-10'}>
            <div className={'font-20 font-medium'}>BNT</div>
            <div className={'bg-secondary h-30 w-30 rounded-full'} />
          </div>
        </div>
        <div className={'flex justify-between'}>
          <div>Simple</div>
          <div className={'text-secondary'}>Type</div>
          <div>Range</div>
        </div>
        <div className={'flex justify-between'}>
          <div>100,000 USDT</div>
          <div className={'text-secondary'}>Budget</div>
          <div>BNT 100,000</div>
        </div>
      </div>
      <div>{hasApproval ? 'true' : 'false'}</div>
      <Button
        size={'lg'}
        fullWidth
        onClick={() => {
          closeModal(id);
        }}
      >
        Confirm
      </Button>
    </Modal>
  );
};
