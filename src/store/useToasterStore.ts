import { ReactNode, useCallback, useState } from 'react';

export interface Toast {
  id: string;
  content: string | ReactNode | ((id: string) => ReactNode);
  duration: number;
  color?: 'primary' | 'buy' | 'sell' | 'warning';
}

const toastFlip = () => {
  const toaster = document.getElementById('toaster');
  if (!toaster) return;
  const previous: Record<string, number> = {};
  const list = toaster.querySelectorAll('li');
  for (const item of list) {
    previous[item.id] = item.getBoundingClientRect().top;
  }
  const animate = () => {
    const newList = toaster.querySelectorAll('li');
    if (newList.length === list.length) requestAnimationFrame(animate);
    for (const item of newList) {
      if (previous[item.id]) {
        const delta = previous[item.id] - item.getBoundingClientRect().top;
        item.animate(
          { transform: [`translateY(${delta}px)`, `translateY(0)`] },
          {
            duration: 200,
            easing: 'ease-out',
          },
        );
      } else {
        item.animate(
          [
            { opacity: 0, scale: '0.8' },
            { opacity: 1, scale: '1' },
          ],
          {
            duration: 200,
            easing: 'ease-out',
          },
        );
      }
    }
  };
  requestAnimationFrame(animate);
};

export type ToastStore = ReturnType<typeof useToastStore>;

export const useToastStore = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback(
    async (id: string) => {
      await document
        .getElementById(id)
        ?.animate(
          { scale: '0.8', opacity: 0 },
          { duration: 200, easing: 'ease-in', fill: 'forwards' },
        ).finished;
      toastFlip();
      setToasts((toasts) => {
        const index = toasts.findIndex((t) => t.id === id);
        return [...toasts.slice(0, index), ...toasts.slice(index + 1)];
      });
    },
    [setToasts],
  );

  const addToast = useCallback(
    (
      content: string | ReactNode | ((id: string) => ReactNode),
      toast: Partial<Omit<Toast, 'content'>> = {},
    ) => {
      const id: string = crypto.randomUUID();
      const newToast: Toast = { id, content, duration: 2000, ...toast };
      setToasts((toasts) => [...toasts, newToast]);
      toastFlip();
      setTimeout(() => removeToast(id), newToast.duration);
      return id;
    },
    [setToasts, removeToast],
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
  removeToast: async () => {},
};
