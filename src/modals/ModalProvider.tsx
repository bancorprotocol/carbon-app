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
import { MODAL_COMPONENTS, ModalSchema } from 'modals/modals/index';
import { AnimatePresence } from 'motion';
import { ModalContext, ModalKey, ModalOpen } from './modals.types';

// ********************************** //
// MODAL CONTEXT
// ********************************** //

const defaultValue: ModalContext = {
  openModal: (key, data) => console.log(key, data),
  closeModal: (id) => console.log(id),
  activeModalId: null,
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

  return (
    <ModalCTX.Provider
      value={{
        openModal,
        closeModal,
        activeModalId,
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
