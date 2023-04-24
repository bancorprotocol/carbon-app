import { FC, ReactElement } from 'react';
import { ReactComponent as IconArrow } from 'assets/icons/arrow-cut.svg';

type MenuItemProps = {
  item: {
    onClick: () => void;
    content: string | ReactElement;
    hasSubMenu?: boolean;
  };
};

export const MenuItem: FC<MenuItemProps> = ({ item }) => {
  const { hasSubMenu, content } = item;
  return (
    <div
      onClick={() => item.onClick()}
      className={
        'hover:bg-body block cursor-pointer rounded-6 p-10 hover:text-white'
      }
    >
      <div
        className={`${hasSubMenu ? 'flex items-center justify-between' : ''}`}
      >
        <span className="w-full">{content}</span>
        {hasSubMenu && <IconArrow className="h-12 w-7" />}
      </div>
    </div>
  );
};
