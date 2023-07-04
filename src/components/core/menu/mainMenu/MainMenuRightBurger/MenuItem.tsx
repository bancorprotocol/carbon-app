import { FC, ReactElement } from 'react';
import { ForwardArrow } from 'components/common/forwardArrow';

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
      className={`text-18 md:text-16 ${
        disableHoverEffect ? 'p-4' : 'md:hover:bg-body p-10'
      } block cursor-pointer rounded-6 md:hover:text-white ${className}`}
    >
      <div
        className={`${hasSubMenu ? 'flex items-center justify-between' : ''}`}
      >
        {content}
        {hasSubMenu && <ForwardArrow />}
      </div>
    </div>
  );
};
