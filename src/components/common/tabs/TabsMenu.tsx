import { FC, ReactNode } from 'react';
import { cn } from 'utils/helpers';

type TabsMenuProps = {
  className?: string;
  children: ReactNode;
};

export const TabsMenu: FC<TabsMenuProps> = ({ children, className }) => {
  return (
    <div className={cn('flex gap-2 bg-black p-2', className)}>{children}</div>
  );
};
