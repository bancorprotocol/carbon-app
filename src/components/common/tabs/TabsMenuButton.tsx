import { FC } from 'react';
import { Button, ButtonProps } from 'components/common/button';

type Props = ButtonProps & {
  isActive?: boolean;
};

export const TabsMenuButton: FC<Props> = ({ children, isActive, ...props }) => {
  const variant = isActive ? 'secondary' : 'black';

  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      className="rounded-8 text-14"
      fullWidth
      {...props}
    >
      {children}
    </Button>
  );
};
