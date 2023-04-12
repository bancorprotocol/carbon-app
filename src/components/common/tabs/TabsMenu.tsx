import { FC, ReactNode } from 'react';

type TabsMenuProps = {
  children: ReactNode;
};

export const TabsMenu: FC<TabsMenuProps> = ({ children }) => {
  return (
    <div className={'flex space-x-2 rounded-10 bg-black p-2'}>{children}</div>
  );
};
