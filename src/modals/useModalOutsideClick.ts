import { RefObject, useCallback, useEffect } from 'react';
import { useModal } from 'modals/ModalProvider';

export const useModalOutsideClick = (
  id: string,
  ref: RefObject<HTMLDivElement>,
  onClick: (id: string) => void
) => {
  const { activeModalId } = useModal();

  const handler = useCallback(() => onClick(id), [id, onClick]);

  useEffect(() => {
    const listener = (event: any) => {
      // Do nothing if clicking ref's element or descendent elements
      if (
        !ref.current ||
        ref.current.contains(event.target) ||
        activeModalId !== id
      ) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, activeModalId, id]);
};
