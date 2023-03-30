import { FC } from 'react';
import { Button, ButtonProps } from 'components/common/button';

type Props = ButtonProps & {
  isActive?: boolean;
};

export const TabsMenuButton: FC<Props> = ({ children, isActive, ...props }) => {
  const variant = isActive ? 'secondary' : 'black';

  return (
    <Button
      variant={variant}
      className={'rounded-6'}
      fullWidth
      {...{ ...props }}
    >
      {children}
    </Button>
  );
};
