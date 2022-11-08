import { Modal } from 'modals/Modal';
import { ModalFC } from 'modals/modals.types';
import { SetUserApprovalProps } from 'queries/chain/approval';
import { ApproveToken } from 'components/approval';

export type ModalTxConfirmData = SetUserApprovalProps[];

export const ModalTxConfirm: ModalFC<ModalTxConfirmData> = ({ id, data }) => {
  return (
    <Modal id={id} title={'Confirm Transaction'}>
      <h3 className={'text-secondary mt-30 mb-20'}>
        1. Allow Contract spending
      </h3>
      <div className={'space-y-20'}>
        {data.map((props, i) => (
          <ApproveToken key={i} {...props} />
        ))}
      </div>
    </Modal>
  );
};
