import { MouseEvent, RefObject, useCallback, useEffect, useRef } from 'react';

interface OpenOptions {
  autofocus?: boolean;
}

export const useDialog = () => {
  const ref = useRef<HTMLDialogElement>(null);

  const open = useCallback((options: OpenOptions = {}) => {
    ref.current!.showModal();
    // Remove auto focus if needed
    if (options.autofocus === false) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }, []);

  const close = useCallback(async () => {
    if (!ref.current) return;
    if (navigator.webdriver) return ref.current.close();
    // Because of Safari we cannot use native transition
    ref.current.classList.add('closing');
    const all = ref.current.getAnimations({ subtree: true });
    await Promise.race([
      Promise.all(all.map((t) => t.finished)),
      new Promise((res) => setTimeout(res, 1_000)),
    ]);
    ref.current.close();
    ref.current?.classList.remove('closing');
  }, []);

  const lightDismiss = useCallback(
    (e: MouseEvent<HTMLDialogElement>) => {
      if (e.target === e.currentTarget) close();
    },
    [close],
  );

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
  }, [cb, ref]);
};
