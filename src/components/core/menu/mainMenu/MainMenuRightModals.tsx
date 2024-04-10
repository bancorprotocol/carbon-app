import { FC } from 'react';
import { useModal } from 'hooks/useModal';
import { Button } from 'components/common/button';

export const MainMenuRightModals: FC = () => {
  const { modals, maximizeModal } = useModal();

  return (
    <>
      {modals.minimized.map((m) => (
        <Button
          key={m.id}
          variant="error"
          size="sm"
          onClick={() => maximizeModal(m.id)}
        >
          {m.key}
        </Button>
      ))}
    </>
  );
};
