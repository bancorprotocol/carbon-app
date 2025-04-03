import { FC } from 'react';
import { cn } from 'utils/helpers';

export interface Preset {
  label: string;
  value: string;
}
interface Props {
  presets: Preset[];
  onChange: (value: string) => void;
  className?: string;
}

export const Presets: FC<Props> = (props) => {
  const { presets, onChange, className } = props;
  return (
    <div role="menu" className={cn('text-12 flex gap-8', className)}>
      {presets.map(({ label, value }, i) => (
        <button
          key={i}
          type="button"
          role="menuitem"
          className="rounded-10 font-weight-500 grid flex-1 cursor-pointer place-items-center bg-black py-8 text-center text-white/60"
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
