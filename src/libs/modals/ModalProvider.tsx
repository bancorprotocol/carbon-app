import { FC, useEffect } from 'react';
import { MODAL_COMPONENTS } from 'libs/modals/modals';
import { AnimatePresence } from 'libs/motion';
import { useModal } from 'hooks/useModal';

export const ModalProvider: FC = () => {
  const {
    modals: { open },
  } = useModal();

  useEffect(() => {
    if (open.length > 0) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [open]);

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
