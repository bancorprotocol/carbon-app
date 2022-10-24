import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import { uuid } from 'utils/helpers';
import { ModalSchema, ModalsMap } from './modals.constants';

type ModalKey = keyof ModalSchema;

interface ModalOpen {
  id: string;
  key: ModalKey;
  data: ModalSchema[ModalKey];
}

interface ModalContext {
  modalsOpen: ModalOpen[];
  openModal: <T extends ModalKey>(key: T, data: ModalSchema[T]) => void;
  closeModal: (id: string) => void;
  getModalData: <T extends ModalKey>(key: T, id: string) => ModalSchema[T];
  activeModalId: string | null;
}

const defaultValue: ModalContext = {
  modalsOpen: [],
  openModal: (key, data) => console.log(key, data),
  closeModal: (id) => console.log(id),
  activeModalId: null,
  getModalData: <T extends ModalKey>(key: T, id: string) => {
    console.log(key, id);
    return {} as ModalSchema[T];
  },
};

const ModalCTX = createContext<ModalContext>(defaultValue);

export const ModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [modalsOpen, setModalsOpen] = useState<ModalOpen[]>([]);

  const openModal = <T extends ModalKey>(key: T, data: ModalSchema[T]) => {
    setModalsOpen((prevState) => [...prevState, { id: uuid(), key, data }]);
  };

  const activeModalId = useMemo(
    () => modalsOpen[modalsOpen.length - 1]?.id ?? null,
    [modalsOpen]
  );

  const closeModal = (id: string) => {
    const index = modalsOpen.findIndex((modal) => modal.id === id);
    if (index > -1) {
      const newModals = [...modalsOpen];
      newModals.splice(index, 1);
      setModalsOpen(newModals);
    }
  };

  const getModalData = <T extends ModalKey>(key: T, id: string) => {
    const state = modalsOpen.find((modal) => modal.id === id);
    if (!state) {
      throw Error(`Modal of key "${key}" with ID: "${id}" not found.`);
    }

    return state.data as ModalSchema[T];
  };

  return (
    <ModalCTX.Provider
      value={{
        openModal,
        closeModal,
        modalsOpen,
        getModalData,
        activeModalId,
      }}
    >
      <>
        {children}

        {modalsOpen.map(({ id, key }) => {
          const Modal = ModalsMap.get(key);
          if (!Modal) {
            return null;
          }
          return <Modal key={id} id={id} />;
        })}
      </>
    </ModalCTX.Provider>
  );
};

export const useModal = () => {
  return useContext(ModalCTX);
};
