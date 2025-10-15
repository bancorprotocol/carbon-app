import { FC, ReactElement } from 'react';
import { ForwardArrow } from 'components/common/forwardArrow';
import { cn } from 'utils/helpers';

type MenuItemProps = {
  className?: string;
  item: {
    onClick?: () => any;
    content?: string | ReactElement;
    hasSubMenu?: boolean;
    disableHoverEffect?: boolean;
  };
};

export const MenuItem: FC<MenuItemProps> = ({ item, className }) => {
  const { content, hasSubMenu, disableHoverEffect = false } = item;

  return (
    <button
      role="menuitem"
      type="button"
      onClick={() => item.onClick && item.onClick()}
      className={cn(
        'rounded-sm cursor-pointer text-18 md:text-16 p-10 hover:bg-black/40 flex items-center justify-between',
        className,
      )}
      disabled={disableHoverEffect}
    >
      {content}
      {hasSubMenu && <ForwardArrow />}
    </button>
  );
};
