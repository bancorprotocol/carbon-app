import { FC, ReactNode } from 'react';
import { ReactComponent as IconClose } from 'assets/icons/X.svg';
import { useStore } from 'store';

interface Props {
  id: string;
  children: ReactNode;
}
export const BaseToast: FC<Props> = ({ id, children }) => {
  const { toaster } = useStore();
  return (
    <li
      id={id}
      className="from-background-900 to-primary-dark text-14 rounded-6 border border-white/10 bg-gradient-to-r"
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

export const DefaultToast: FC<Props> = ({ id, children }) => {
  return (
    <BaseToast id={id}>
      <output className="p-16">{children}</output>
    </BaseToast>
  );
};
