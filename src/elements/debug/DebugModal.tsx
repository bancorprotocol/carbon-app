import { FC } from 'react';
import { useModal } from 'modals';

export const DebugModal: FC = () => {
  const { openModal } = useModal();

  return (
    <>
      <h2>Modals</h2>
      <div>
        <button
          onClick={() =>
            openModal('createStrategy', { foo: 'asd', bar: 'asd' })
          }
        >
          open create strategy modal
        </button>
      </div>
    </>
  );
};
