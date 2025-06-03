import { useCallback } from 'react';
import { ModalKey } from 'libs/modals/modals.types';
import { uuid } from 'utils/helpers';
import { useStore } from 'store';
import { ModalSchema } from 'libs/modals/modals';

export const useModal = () => {
  const {
    isCountryBlocked,
    modals: { setModalsOpen, modals, setModalsMinimized, activeModalId },
  } = useStore();
  const { open: modalsOpen, minimized: modalsMinimized } = modals;

  const openModal = useCallback(
    <T extends ModalKey>(key: T, data: ModalSchema[T]) => {
      if (key === 'wallet') {
        if (isCountryBlocked === null) {
          return;
        }
        if (isCountryBlocked) {
          openModal('restrictedCountry', undefined);
          return;
        }
      }
      setModalsOpen((prevState) => [...prevState, { id: uuid(), key, data }]);
    },
    [isCountryBlocked, setModalsOpen],
  );

  const closeModal = useCallback(
    (id: string) => {
      const index = modalsOpen.findIndex((modal) => modal.id === id);
      if (index > -1) {
        const newModals = [...modalsOpen];
        newModals.splice(index, 1);
        setModalsOpen(newModals);
      }
    },
    [modalsOpen, setModalsOpen],
  );

  const minimizeModal = (id: string) => {
    const index = modalsOpen.findIndex((modal) => modal.id === id);
    if (index > -1) {
      const newModals = [...modalsOpen];
      const modalFound = newModals.splice(index, 1);
      setModalsOpen(newModals);
      setModalsMinimized((prevState) => [...prevState, modalFound[0]!]);
    }
  };

  const maximizeModal = (id: string) => {
    const index = modalsMinimized.findIndex((modal) => modal.id === id);
    if (index > -1) {
      const newModals = [...modalsMinimized];
      const modalFound = newModals.splice(index, 1);
      setModalsMinimized(newModals);
      setModalsOpen((prevState) => [...prevState, modalFound[0]!]);
    }
  };

  return {
    modals,
    openModal,
    closeModal,
    activeModalId,
    minimizeModal,
    maximizeModal,
  };
};
