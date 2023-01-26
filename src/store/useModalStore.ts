import { Dispatch, SetStateAction, useMemo, useState } from 'react';
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

  const modals = useMemo(
    () => ({
      open: modalsOpen,
      minimized: modalsMinimized,
    }),
    [modalsMinimized, modalsOpen]
  );

  const activeModalId = useMemo(
    () => modalsOpen[modalsOpen.length - 1]?.id ?? null,
    [modalsOpen]
  );

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
