import { useCallback, useEffect, useRef, useState } from 'react';

interface Toast {
  id: string;
  content: string;
  duration: number;
}

export type ToastStore = ReturnType<typeof useToastStore>;

export const useToastStore = () => {
  const toastRef = useRef<Toast[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Because we use setTimeout, removeToast will reference the old state.
  // By using a reference we avoid this
  useEffect(() => {
    toastRef.current = toasts;
  }, [toasts]);

  const removeToast = useCallback(
    (id: string) => {
      const nextList = [...toastRef.current];
      const index = nextList.findIndex((t) => t.id === id);
      if (index < 0) return;
      nextList.splice(index, 1);
      setToasts(nextList);
    },
    [toastRef, setToasts]
  );

  const addToast = useCallback(
    (content: string, toast: Partial<Omit<Toast, 'content'>> = {}) => {
      const id: string = crypto.randomUUID();
      const newToast: Toast = { id, content, duration: 2000, ...toast };
      setToasts([...toasts, newToast]);
      setTimeout(() => removeToast(id), newToast.duration);
      return id;
    },
    [toasts, setToasts, removeToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
  };
};

export const defaultToastStore: ToastStore = {
  toasts: [],
  addToast: () => '',
  removeToast: () => {},
};
