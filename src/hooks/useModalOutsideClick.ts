import { RefObject, useEffect } from 'react';
import { useModal } from 'providers/ModalProvider';

export const useModalOutsideClick = (
  id: string,
  ref: RefObject<HTMLDivElement>,
  handler: Function
) => {
  const { activeModalId } = useModal();
  useEffect(
    () => {
      const listener = (event: any) => {
        // Do nothing if clicking ref's element or descendent elements
        if (
          !ref.current ||
          ref.current.contains(event.target) ||
          activeModalId !== id
        ) {
          return;
        }
        handler(event);
      };

      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);
      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    },
    // TODO: wrap handler in useCallback
    [ref, handler, activeModalId, id]
  );
};
