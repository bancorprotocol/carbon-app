import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import { uuid } from 'utils/helpers';
import { ExtractModalData, Modals } from 'modals/types.modal';
import { ModalWallet } from 'modals/ModalWallet';

export enum ModalType {
  WALLET,
}

type ModalState = {
  id: string;
  type: ModalType;
  data: ExtractModalData<Modals, ModalType>['data'];
}[];

const tmpOpenFn = <T extends ModalType>(
  type: T,
  data: ExtractModalData<Modals, T>['data'] extends infer R
    ? { [key in keyof R]: R[key] }
    : never
) => {
  console.log(data);
};

const tmpDataFn = <T extends ModalType>(
  type: T,
  id: string
): ExtractModalData<Modals, T>['data'] => {
  return {} as ExtractModalData<Modals, T>['data'];
};

interface ModalContext {
  modalsOpen: ModalState;
  openModal: typeof tmpOpenFn;
  closeModal: (id: string) => void;
  isModalOpen: (id: string) => boolean;
  getModalData: typeof tmpDataFn;
  activeModalId: string | null;
}

const defaultValue: ModalContext = {
  modalsOpen: [],
  openModal: (type, data) => {},
  closeModal: (id) => {},
  isModalOpen: (id) => false,
  activeModalId: null,
  // @ts-ignore
  getModalData: (type, id) => {},
};

const ModalCTX = createContext<ModalContext>(defaultValue);

export const ModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [modalsOpen, setModalsOpen] = useState<ModalState>([]);

  const openModal = <T extends ModalType>(
    type: T,
    data: ExtractModalData<Modals, T>['data']
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

    return state.data as ExtractModalData<Modals, T>['data'];
  };

  const isModalOpen = (id: string) => {
    return !!modalsOpen.find((modal) => modal.id === id);
  };

  return (
    <ModalCTX.Provider
      value={{
        // @ts-ignore
        openModal,
        closeModal,
        isModalOpen,
        activeModalId,
        modalsOpen,
        getModalData,
      }}
    >
      <>
        {children}

        {modalsOpen.map(({ id, type }) => {
          return (
            <div key={id}>
              {type === ModalType.WALLET && <ModalWallet id={id} />}
            </div>
          );
        })}
      </>
    </ModalCTX.Provider>
  );
};

export const useModal = () => {
  return useContext(ModalCTX);
};
