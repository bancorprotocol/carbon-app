import { Modal } from 'modals/Modal';
import { ModalFC } from 'modals/modals.types';
import TokenInputField from 'elements/trade/TokenInputField';
import { useState } from 'react';
import { Button } from 'components/Button';
import { Token } from 'services/tokens';

export type ModalWithdrawData = {
  token: Token;
};

export const ModalWithdraw: ModalFC<ModalWithdrawData> = ({ id, data }) => {
  const [input, setInput] = useState('');
  const { token } = data;

  return (
    <Modal id={id} title={'Withdraw'}>
      <div className="flex flex-col gap-10 p-10 md:p-30">
        <TokenInputField input={input} setInput={setInput} token={token} />

        <Button className="h-50 rounded-full">Withdraw</Button>
      </div>
    </Modal>
  );
};
