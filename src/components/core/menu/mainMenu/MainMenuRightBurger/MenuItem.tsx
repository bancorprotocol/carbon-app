import { FC, ReactElement } from 'react';
import { ReactComponent as IconArrow } from 'assets/icons/arrow-cut.svg';

type MenuItemProps = {
  item: {
    onClick: () => void;
    content: string | ReactElement;
    hasSubMenu?: boolean;
    disableHoverEffect?: boolean;
    className?: string;
  };
};

export const MenuItem: FC<MenuItemProps> = ({ item }) => {
  const {
    content,
    hasSubMenu,
    disableHoverEffect = false,
    className = '',
  } = item;
  return (
    <div
      onClick={() => item.onClick()}
      className={`${
        disableHoverEffect ? 'p-4' : 'hover:bg-body p-10'
      } block cursor-pointer rounded-6 hover:text-white ${className}`}
    >
      <div
        className={`${hasSubMenu ? 'flex items-center justify-between' : ''}`}
      >
        {content}
        {hasSubMenu && <IconArrow className="h-12 w-7" />}
      </div>
    </div>
  );
};
