import { FC, ReactNode } from 'react';

type TabsMenuProps = {
  children: ReactNode;
};

export const TabsMenu: FC<TabsMenuProps> = ({ children }) => {
  return (
    <div className="rounded-10 flex space-x-2 bg-black p-2">{children}</div>
  );
};
