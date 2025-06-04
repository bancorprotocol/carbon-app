import { FC, ReactElement } from 'react';
import { ForwardArrow } from 'components/common/forwardArrow';
import { cn } from 'utils/helpers';

type MenuItemProps = {
  item: {
    onClick?: () => any;
    content?: string | ReactElement;
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
      className={cn(
        'text-18 md:text-16',
        disableHoverEffect ? 'p-4' : 'p-10 md:hover:bg-black',
        'rounded-6 block cursor-pointer md:hover:text-white',
        className,
      )}
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
