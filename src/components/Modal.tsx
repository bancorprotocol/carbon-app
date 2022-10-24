import { FC, ReactNode, useRef } from 'react';
import { useModal } from 'providers/ModalProvider';
import { useModalOutsideClick } from 'hooks/useModalOutsideClick';

type Props = {
  children: ReactNode;
  id: string;
};

export const Modal: FC<Props> = ({ children, id }) => {
  const { closeModal } = useModal();
  const ref = useRef<HTMLDivElement>(null);
  useModalOutsideClick(id, ref, () => closeModal(id));

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-red-500/30 px-3 outline-none backdrop-blur focus:outline-none`}
    >
      <div className="relative my-6 mx-auto w-auto max-w-3xl">
        <div
          ref={ref}
          className="relative flex max-h-[70vh] w-full flex-col overflow-y-auto rounded-2xl border-0 bg-gray-400 p-10 outline-none focus:outline-none"
        >
          {children}
        </div>
      </div>
    </div>
  );
};
