import { FC, ReactNode } from 'react';

type TabsMenuProps = {
  children: ReactNode;
};

export const TabsMenu: FC<TabsMenuProps> = ({ children }) => {
  return (
    <div className={'flex space-x-5 rounded-10 bg-black p-5'}>{children}</div>
  );
};
