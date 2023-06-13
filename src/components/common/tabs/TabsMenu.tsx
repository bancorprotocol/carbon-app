import { FC, ReactNode } from 'react';

type TabsMenuProps = {
  children: ReactNode;
};

export const TabsMenu: FC<TabsMenuProps> = ({ children }) => {
  return (
    <div className={'space-s-2 flex rounded-10 bg-black p-2'}>{children}</div>
  );
};
