import { m } from 'framer-motion';
import { BaseHTMLAttributes, DetailedHTMLProps, FC } from 'react';
import { VariantProps } from 'class-variance-authority';
import { switchStyles } from 'components/common/switch/switchStyles';
import { cn } from 'utils/helpers';

type SwitchHTMLProps = DetailedHTMLProps<
  BaseHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

type SwitchProps = SwitchHTMLProps &
  VariantProps<typeof switchStyles> & {
    isOn: boolean;
    setIsOn: (isOn: boolean) => void;
  };

export const Switch: FC<SwitchProps> = ({
  variant,
  size,
  className,
  isOn,
  setIsOn,
  id,
  ...props
}) => {
  return (
    <>
      <div
        className={cn(
          'relative',
          switchStyles({ variant, size, isOn, class: className }),
        )}
        {...props}
      >
        <input
          className="peer absolute inset-0 cursor-pointer opacity-0"
          type="checkbox"
          checked={isOn}
          id={id}
          onChange={(e) => setIsOn(e.target.checked)}
        />
        <m.div
          className={cn(
            'aspect-square h-10 rounded-full outline-2',
            isOn ? 'bg-black outline-black' : 'bg-white/60 outline-white/60',
            'peer-focus-visible:outline',
          )}
          layout
          transition={spring}
        />
      </div>
    </>
  );
};

const spring = {
  type: 'spring',
  mass: 0.6,
  stiffness: 700,
  damping: 30,
};
