import { FC } from 'react';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { Link } from '@tanstack/react-router';
import IconSlow from 'assets/icons/slow.svg?react';
import IconFast from 'assets/icons/fast.svg?react';
import KeyboardArrowDownIcon from 'assets/icons/keyboard_arrow_down.svg?react';

interface Props {
  speed: 'fast' | 'slow';
}

const items = {
  fast: {
    Icon: IconFast,
    to: '/trade/quick-auction' as const,
    label: 'Fast auction',
  },
  slow: {
    Icon: IconSlow,
    to: '/trade/auction' as const,
    label: 'Slow auction',
  },
};

export const GradientSpeed: FC<Props> = ({ speed }) => {
  const item = items[speed];
  return (
    <DropdownMenu
      className="rounded-xl p-8 grid gap-4"
      button={(attr) => (
        <button
          {...attr}
          className="surface flex gap-16 items-center px-16 py-8 rounded-2xl"
        >
          <item.Icon className="size-24" />
          <span className="flex-1 text-start text-18 capitalize">
            {item.label}
          </span>
          <KeyboardArrowDownIcon className="size-24" />
        </button>
      )}
    >
      {Object.entries(items).map(([id, item]) => (
        <Link
          key={id}
          to={item.to}
          data-selected={speed === id}
          className="flex gap-8 items-center px-16 py-8 rounded-sm w-full hover:bg-main-900/40 data-[selected=true]:bg-main-900/60"
          search={(s) => ({
            base: s.base,
            quote: s.quote,
            marketPrice: s.marketPrice,
            chartStart: s.chartStart,
            chartEnd: s.chartEnd,
          })}
        >
          <item.Icon className="size-16" />
          <span>{item.label}</span>
        </Link>
      ))}
    </DropdownMenu>
  );
};
