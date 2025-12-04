import { FC, ReactNode } from 'react';
import { ModalSchema } from 'libs/modals/modals';

export interface ModalHeaderProps {
  id: string;
  children?: ReactNode;
  className?: string;
}

// export type TModals = {
//   [key in keyof ModalSchema]: FC<{ id: string; data: ModalSchema[key] }>;
// };

export type ModalKey = keyof ModalSchema;

export interface ModalOpen {
  id: string;
  key: ModalKey;
  data: ModalSchema[ModalKey];
}

export type ModalProps<D = void> = D extends void
  ? { id: string }
  : {
      id: string;
      data: D;
    };

export type ModalFC<D> = FC<ModalProps<D>>;
