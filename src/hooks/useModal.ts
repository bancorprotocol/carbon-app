import { useCallback } from 'react';
import { ModalKey } from 'libs/modals/modals.types';
import { uuid } from 'utils/helpers';
import { useStore } from 'store';
import { ModalSchema } from 'libs/modals/modals';

export const useModal = () => {
  const {
    modals: { setModalsOpen, modals },
  } = useStore();
  const { open: modalsOpen } = modals;

  const removeModal = useCallback(
    (id: string) => {
      const index = modalsOpen.findIndex((modal) => modal.id === id);
      if (index > -1) {
        const copy = [...modalsOpen];
        copy.splice(index, 1);
        setModalsOpen(copy);
      }
    },
    [modalsOpen, setModalsOpen],
  );

  const closeModal = useCallback((id: string) => {
    // trigger lightdismiss
    document.getElementById(id)?.click();
  }, []);

  const openModal = useCallback(
    <T extends ModalKey>(key: T, data: ModalSchema[T]) => {
      const id = uuid();
      setModalsOpen((prevState) => [...prevState, { id, key, data }]);
    },
    [setModalsOpen],
  );

  return {
    modals,
    openModal,
    closeModal,
    removeModal,
  };
};
