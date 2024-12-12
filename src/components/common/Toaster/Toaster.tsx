import { FC } from 'react';
import { useStore } from 'store';
import { Toast } from 'store/useToasterStore';
import { DefaultToast } from './Toast';

export const Toaster: FC = () => {
  const { toaster } = useStore();
  return (
    <ul
      id="toaster"
      className="fixed bottom-16 right-24 z-10 flex min-w-[250px] flex-col gap-8"
    >
      {toaster.toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </ul>
  );
};

const ToastItem: FC<Toast> = ({ id, content }) => {
  switch (typeof content) {
    case 'function':
      return content(id);
    case 'string':
      return <DefaultToast id={id}>{content}</DefaultToast>;
    default:
      return content;
  }
};
