import { Dispatch, SetStateAction, useState } from 'react';
import { ModalOpen } from 'libs/modals/modals.types';

export interface ModalStore {
  modals: { open: ModalOpen[] };
  setModalsOpen: Dispatch<SetStateAction<ModalOpen[]>>;
}

export const useModalStore = (): ModalStore => {
  const [modalsOpen, setModalsOpen] = useState<ModalOpen[]>([]);

  const modals = {
    open: modalsOpen,
  };

  return {
    modals,
    setModalsOpen,
  };
};

export const defaultModalStore: ModalStore = {
  modals: { open: [] },
  setModalsOpen: () => {},
};
