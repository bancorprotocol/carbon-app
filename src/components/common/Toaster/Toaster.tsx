import { FC } from 'react';
import { useStore } from 'store';

export const Toaster: FC = () => {
  const { toaster } = useStore();
  return (
    <ul className="fixed bottom-16 right-16 z-10">
      {toaster.toasts.map((toast) => (
        <li
          key={toast.id}
          className="animate-slideUp bg-background-800 my-5 rounded-full border border-white/60 px-16 py-8"
        >
          <output>{toast.content}</output>
        </li>
      ))}
    </ul>
  );
};
