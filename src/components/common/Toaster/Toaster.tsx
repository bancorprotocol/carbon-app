import { FC } from 'react';
import { useStore } from 'store';
import { ReactComponent as IconClose } from 'assets/icons/X.svg';

export const Toaster: FC = () => {
  const { toaster } = useStore();
  return (
    <ul
      id="toaster"
      className="fixed bottom-16 right-16 z-10 flex min-w-[250px] flex-col gap-8"
    >
      {toaster.toasts.map((toast) => (
        <li
          id={toast.id}
          key={toast.id}
          className="from-background-900 to-primary-dark text-14 rounded-6 border border-white/10 bg-gradient-to-r from-30%"
        >
          {typeof toast.content === 'string' ? (
            <output className="flex">
              <p className="p-16">{toast.content}</p>
              <button
                className="p-16 text-white/80"
                aria-label="close message"
                onClick={() => toaster.removeToast(toast.id)}
              >
                <IconClose className="size-10" />
              </button>
            </output>
          ) : (
            toast.content
          )}
        </li>
      ))}
    </ul>
  );
};
