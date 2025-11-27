import { FC, Suspense } from 'react';
import { MODAL_COMPONENTS } from 'libs/modals/modals';
import { useModal } from 'hooks/useModal';

export const ModalProvider: FC = () => {
  const {
    modals: { open },
  } = useModal();

  return (
    <>
      {open.map(({ id, key, data }) => {
        const Modal = MODAL_COMPONENTS[key];
        return (
          <Suspense key={id}>
            {/* @ts-expect-error no need for strong typing */}
            <Modal id={id} data={data} />;
          </Suspense>
        );
      })}
    </>
  );
};
