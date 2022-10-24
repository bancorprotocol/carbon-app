import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import { uuid } from 'utils/helpers';
import { AllModalsUnion, ModalsMap, ModalType } from './modals.constants';
import { DataTypeById } from 'types/extractDataById.types';

interface ModalOpen {
  id: string;
  type: ModalType;
  data: AllModalsUnion['data'];
}

interface ModalContext {
  modalsOpen: ModalOpen[];
  openModal: <T extends ModalType>(
    type: T,
    data: DataTypeById<AllModalsUnion, T>
  ) => void;
  closeModal: (id: string) => void;
  getModalData: <T extends ModalType>(
    type: T,
    id: string
  ) => DataTypeById<AllModalsUnion, T>;
  activeModalId: string | null;
}

const defaultValue: ModalContext = {
  modalsOpen: [],
  openModal: (type, data) => console.log(type, data),
  closeModal: (id) => console.log(id),
  activeModalId: null,
  getModalData: <T extends ModalType>(type: T, id: string) => {
    console.log(type, id);
    return {} as DataTypeById<AllModalsUnion, T>;
  },
};

const ModalCTX = createContext<ModalContext>(defaultValue);

export const ModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [modalsOpen, setModalsOpen] = useState<ModalOpen[]>([]);

  const openModal = <T extends ModalType>(
    type: T,
    data: DataTypeById<AllModalsUnion, T>
  ) => {
    setModalsOpen((prevState) => [...prevState, { id: uuid(), type, data }]);
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

  const getModalData = <T extends ModalType>(type: T, id: string) => {
    const state = modalsOpen.find((modal) => modal.id === id);
    if (!state) {
      throw Error(`Modal of type "${type}" with ID: "${id}" not found.`);
    }

    return state.data as DataTypeById<AllModalsUnion, T>;
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

        {modalsOpen.map(({ id, type }) => {
          const Modal = ModalsMap.get(type);
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
