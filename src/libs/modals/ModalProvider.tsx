import { FC, useEffect } from 'react';
import { MODAL_COMPONENTS } from 'libs/modals/modals';
import { AnimatePresence } from 'libs/motion';
import { useModal } from 'hooks/useModal';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

export const ModalProvider: FC = () => {
  const {
    modals: { open },
  } = useModal();

  useEffect(() => {
    if (open.length > 0) {
      const scrollTarget = document.querySelector('#bodyScrollTarget');
      if (scrollTarget) disableBodyScroll(scrollTarget);
      document.documentElement.classList.add('overflow-hidden');
      document.body.classList.add('overflow-hidden');
    } else {
      clearAllBodyScrollLocks();
      document.documentElement.classList.remove('overflow-hidden');
      document.body.classList.remove('overflow-hidden');
    }
  }, [open]);

  return (
    <AnimatePresence initial={false}>
      {open.map(({ id, key, data }) => {
        const Modal = MODAL_COMPONENTS[key];
        // @ts-expect-error no need for strong typing
        return <Modal key={id} id={id} data={data} />;
      })}
    </AnimatePresence>
  );
};
