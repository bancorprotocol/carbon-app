import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { uuid } from 'utils/helpers';
import { MODAL_COMPONENTS, ModalSchema } from 'libs/modals/modals';
import { AnimatePresence } from 'libs/motion';
import { ModalContext, ModalKey, ModalOpen } from 'libs/modals/modals.types';

// ********************************** //
// MODAL CONTEXT
// ********************************** //

const defaultValue: ModalContext = {
  modals: { open: [], minimized: [] },
  openModal: () => {},
  closeModal: () => {},
  activeModalId: null,
  minimizeModal: () => {},
  maximizeModal: () => {},
};

const ModalCTX = createContext(defaultValue);

export const useModal = () => {
  return useContext(ModalCTX);
};

// ********************************** //
// MODAL PROVIDER
// ********************************** //

export const ModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [modalsOpen, setModalsOpen] = useState<ModalOpen[]>([]);
  const [modalsMinimized, setModalsMinimized] = useState<ModalOpen[]>([]);

  const modals = useMemo(
    () => ({
      open: modalsOpen,
      minimized: modalsMinimized,
    }),
    [modalsMinimized, modalsOpen]
  );

  const openModal = useCallback(
    <T extends ModalKey>(key: T, data: ModalSchema[T]) => {
      setModalsOpen((prevState) => [...prevState, { id: uuid(), key, data }]);
    },
    []
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
    [modalsOpen]
  );

  const activeModalId = useMemo(
    () => modalsOpen[modalsOpen.length - 1]?.id ?? null,
    [modalsOpen]
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

  return (
    <ModalCTX.Provider
      value={{
        modals,
        openModal,
        closeModal,
        activeModalId,
        minimizeModal,
        maximizeModal,
      }}
    >
      {children}

      <AnimatePresence initial={false}>
        {modalsOpen.map(({ id, key, data }) => {
          const Modal = MODAL_COMPONENTS[key];
          // @ts-ignore
          return <Modal key={id} id={id} data={data} />;
        })}
      </AnimatePresence>
    </ModalCTX.Provider>
  );
};
