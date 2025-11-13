import { FC, ReactNode } from 'react';
import { ModalSchema } from 'libs/modals/modals';

export interface ModalProps {
  children: ReactNode;
  id: string;
  className?: string;
  placement?: 'center' | 'side';
  onClose?: (id: string) => void;
  'data-testid'?: string;
}

export type TModals = {
  [key in keyof ModalSchema]: FC<{ id: string; data: ModalSchema[key] }>;
};

export type ModalKey = keyof ModalSchema;

export interface ModalOpen {
  id: string;
  key: ModalKey;
  data: ModalSchema[ModalKey];
}

export type ModalFC<D> = FC<{
  id: string;
  data: D;
}>;
