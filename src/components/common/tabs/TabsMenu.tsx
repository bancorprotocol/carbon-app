import { FC, ReactNode } from 'react';
import { cn } from 'utils/helpers';

type TabsMenuProps = {
  className?: string;
  children: ReactNode;
};

export const TabsMenu: FC<TabsMenuProps> = ({ children, className }) => {
  return (
    <div className={cn('grid grid-cols-2 p-16', className)}>{children}</div>
  );
};
