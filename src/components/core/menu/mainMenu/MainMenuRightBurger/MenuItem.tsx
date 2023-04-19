import { FC, ReactElement } from 'react';

type MenuItemProps = {
  onClick: () => void;
  content: string | ReactElement;
};

export const MenuItem: FC<MenuItemProps> = ({ onClick, content }) => {
  return (
    <div
      onClick={onClick}
      className={
        'hover:bg-body block cursor-pointer rounded-6 p-10 hover:text-white'
      }
    >
      {content}
    </div>
  );
};
