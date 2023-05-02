import { FC } from 'react';
import { Button, ButtonProps } from 'components/common/button';

type Props = ButtonProps & {
  isActive?: boolean;
  className?: string;
};

export const TabsMenuButton: FC<Props> = ({ children, isActive, ...props }) => {
  const variant = isActive ? 'secondary' : 'black';

  return (
    <Button
      variant={variant}
      className={`h-[30px] rounded-8 ${
        isActive ? 'cursor-default border-emphasis bg-emphasis' : ''
      }`}
      fullWidth
      {...{ ...props }}
    >
      {children}
    </Button>
  );
};
