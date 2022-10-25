import { FC } from 'react';
import { ModalSchema } from 'modals/modals/index';

export type TModals = {
  [key in keyof ModalSchema]: FC<{ id: string; data: ModalSchema[key] }>;
};

export type ModalKey = keyof ModalSchema;

export interface ModalOpen {
  id: string;
  key: ModalKey;
  data: ModalSchema[ModalKey];
}

export interface ModalContext {
  openModal: <T extends ModalKey>(key: T, data: ModalSchema[T]) => void;
  closeModal: (id: string) => void;
  activeModalId: string | null;
}

export type ModalFC<D> = FC<{
  id: string;
  data: D;
}>;
