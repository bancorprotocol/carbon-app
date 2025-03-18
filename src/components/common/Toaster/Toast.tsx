import { FC, ReactNode } from 'react';
import { ReactComponent as IconClose } from 'assets/icons/X.svg';
import { useStore } from 'store';
import { Toast } from 'store/useToasterStore';

interface Props {
  id: string;
  color?: Toast['color'];
  children: ReactNode;
}
export const BaseToast: FC<Props> = ({ id, children, color = 'primary' }) => {
  const { toaster } = useStore();
  return (
    <li
      id={id}
      style={{
        backgroundImage: `linear-gradient(to right, transparent, var(--${color}-dark))`,
      }}
      className="bg-background-900 text-14 rounded-6 flex items-center border border-white/10"
    >
      {children}
      <button
        className="p-16 text-white/80"
        aria-label="close message"
        onClick={() => toaster.removeToast(id)}
      >
        <IconClose className="size-10" />
      </button>
    </li>
  );
};

export const DefaultToast: FC<Props> = ({ id, children, color }) => {
  return (
    <BaseToast id={id} color={color}>
      <output className="flex-1 p-16">{children}</output>
    </BaseToast>
  );
};
