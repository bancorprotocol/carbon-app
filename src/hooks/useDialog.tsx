import { MouseEvent, RefObject, useEffect, useRef } from 'react';

export const useDialog = () => {
  const ref = useRef<HTMLDialogElement>(null);
  const open = () => {
    ref.current!.showModal();
    // Remove auto focus if needed
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };
  const close = async () => {
    if (!ref.current) return;
    if (navigator.webdriver) return ref.current.close();
    // Because of Safari we cannot use native transition
    ref.current.classList.add('closing');
    const all = ref.current.getAnimations({ subtree: true });
    await Promise.all(all.map((t) => t.finished));
    ref.current.close();
    ref.current?.classList.remove('closing');
  };
  const lightDismiss = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) close();
  };

  return {
    ref,
    open,
    close,
    lightDismiss,
  };
};

export const useOnDialogClose = (
  ref: RefObject<HTMLDialogElement | null>,
  cb: (event: Event) => any,
) => {
  useEffect(() => {
    const dialog = ref.current;
    dialog?.addEventListener('close', cb);
    return () => dialog?.removeEventListener('close', cb);
  });
};
