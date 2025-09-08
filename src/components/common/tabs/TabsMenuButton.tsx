import { FC } from 'react';
import { Button, ButtonProps } from 'components/common/button';

type Props = ButtonProps & {
  variant: 'buy' | 'sell' | 'black';
};

export const TabsMenuButton: FC<Props> = ({ children, variant, ...props }) => {
  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      className="flex-1 rounded-md text-14"
      {...props}
    >
      {children}
    </Button>
  );
};
