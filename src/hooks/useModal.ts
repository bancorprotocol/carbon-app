import { useCallback } from 'react';
import { ModalKey } from 'libs/modals/modals.types';
import { uuid } from 'utils/helpers';
import { useStore } from 'store';
import { ModalSchema } from 'libs/modals/modals';

export const useModal = () => {
  const {
    isCountryBlocked,
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
      if (key === 'wallet') {
        if (isCountryBlocked === null) {
          return;
        }
        if (isCountryBlocked) {
          openModal('restrictedCountry', undefined);
          return;
        }
      }
      const id = uuid();
      setModalsOpen((prevState) => [...prevState, { id, key, data }]);
    },
    [setModalsOpen, isCountryBlocked],
  );

  return {
    modals,
    openModal,
    closeModal,
    removeModal,
  };
};
