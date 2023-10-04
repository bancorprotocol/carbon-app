import { Dispatch, SetStateAction, useState } from 'react';
import { ModalOpen } from 'libs/modals/modals.types';

export interface ModalStore {
  modals: { open: ModalOpen[]; minimized: ModalOpen[] };
  activeModalId: string;
  setModalsOpen: Dispatch<SetStateAction<ModalOpen[]>>;
  setModalsMinimized: Dispatch<SetStateAction<ModalOpen[]>>;
}

export const useModalStore = (): ModalStore => {
  const [modalsOpen, setModalsOpen] = useState<ModalOpen[]>([]);
  const [modalsMinimized, setModalsMinimized] = useState<ModalOpen[]>([]);

  const modals = {
    open: modalsOpen,
    minimized: modalsMinimized,
  };

  const activeModalId = modalsOpen[modalsOpen.length - 1]?.id ?? null;

  return {
    modals,
    activeModalId,
    setModalsOpen,
    setModalsMinimized,
  };
};

export const defaultModalStore: ModalStore = {
  modals: { open: [], minimized: [] },
  setModalsOpen: () => {},
  activeModalId: '',
  setModalsMinimized: () => {},
};
