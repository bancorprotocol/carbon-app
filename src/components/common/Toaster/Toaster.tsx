import { FC } from 'react';
import { useStore } from 'store';

export const Toaster: FC = () => {
  const { toaster } = useStore();
  return (
    <ul
      id="toaster"
      className="fixed bottom-16 right-16 z-10 flex flex-col gap-8"
    >
      {toaster.toasts.map((toast) => (
        <li id={toast.id} key={toast.id}>
          {typeof toast.content === 'string' ? (
            <output className="bg-background-900 text-14 rounded-6 block border border-white/10 p-16">
              {toast.content}
            </output>
          ) : (
            toast.content
          )}
        </li>
      ))}
    </ul>
  );
};
