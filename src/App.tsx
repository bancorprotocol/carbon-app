import React from 'react';
import { ModalType, useModal } from 'modals/ModalProvider';

export const App = () => {
  const { openModal } = useModal();
  return (
    <div>
      <h1 className={'text-red-600'}>Hello</h1>
      <button
        onClick={() => openModal(ModalType.WALLET, { foo: 'asd', bar: 'asd' })}
      >
        open wallet modal
      </button>
    </div>
  );
};
