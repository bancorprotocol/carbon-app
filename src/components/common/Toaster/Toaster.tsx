import { FC } from 'react';
import { useStore } from 'store';

export const Toaster: FC = () => {
  const { toaster } = useStore();
  return (
    <ul className="fixed bottom-16 right-16 z-10">
      {toaster.toasts.map((toast) => (
        <li
          key={toast.id}
          className="my-5 animate-slideUp rounded-full border border-white/60 bg-emphasis py-8 px-16"
        >
          <output>{toast.content}</output>
        </li>
      ))}
    </ul>
  );
};
