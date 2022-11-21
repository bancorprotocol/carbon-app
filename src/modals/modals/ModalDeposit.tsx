import { Modal } from 'modals/Modal';
import { ModalFC } from 'modals/modals.types';
import TokenInputField from 'elements/trade/TokenInputField';
import { useState } from 'react';
import { Button } from 'components/Button';
import { Token } from 'services/tokens';

export type ModalDepositData = {
  token: Token;
};

export const ModalDeposit: ModalFC<ModalDepositData> = ({ id, data }) => {
  const [input, setInput] = useState('');
  const { token } = data;

  return (
    <Modal id={id} title={'Deposit'}>
      <div className="flex flex-col gap-10 p-10 md:p-30">
        <TokenInputField input={input} setInput={setInput} token={token} />

        <Button className="h-50 rounded-full">Deposit</Button>
      </div>
    </Modal>
  );
};
