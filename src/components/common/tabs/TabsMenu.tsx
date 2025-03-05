import { FC, ReactNode } from 'react';

type TabsMenuProps = {
  children: ReactNode;
};

export const TabsMenu: FC<TabsMenuProps> = ({ children }) => {
  return <div className="flex gap-2 bg-black p-2">{children}</div>;
};
