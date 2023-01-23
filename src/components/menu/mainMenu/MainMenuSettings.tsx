import { FC } from 'react';
import { useModal } from 'libs/modals';
import { ReactComponent as IconCog } from 'assets/icons/cog.svg';
import { Button } from 'components/common/button';

export const MainMenuSettings: FC = () => {
  const { openModal } = useModal();

  return (
    <Button
      variant={'secondary'}
      className={'flex w-40 items-center justify-center !p-0'}
      onClick={() => openModal('notifications', undefined)}
    >
      <IconCog className={'h-20 w-20'} />
    </Button>
  );
};
