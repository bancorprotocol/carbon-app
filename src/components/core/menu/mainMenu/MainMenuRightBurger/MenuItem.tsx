import { FC, ReactElement } from 'react';
import { ReactComponent as IconArrow } from 'assets/icons/arrow-cut.svg';

type MenuItemProps = {
  item: {
    onClick?: Function;
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
      onClick={() => item.onClick && item.onClick()}
      className={`text-18 md:text-16${
        disableHoverEffect ? 'p-4' : 'md:hover:bg-body p-10'
      } block cursor-pointer rounded-6 md:hover:text-white ${className}`}
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
