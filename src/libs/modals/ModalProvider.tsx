import { FC } from 'react';
import { MODAL_COMPONENTS } from 'libs/modals/modals';
import { AnimatePresence } from 'libs/motion';
import { useModal } from 'hooks/useModal';

export const ModalProvider: FC = () => {
  const {
    modals: { open },
  } = useModal();

  return (
    <AnimatePresence initial={false}>
      {open.map(({ id, key, data }) => {
        const Modal = MODAL_COMPONENTS[key];
        // @ts-ignore
        return <Modal key={id} id={id} data={data} />;
      })}
    </AnimatePresence>
  );
};
