import { motion } from 'framer-motion';
import { BaseHTMLAttributes, DetailedHTMLProps, FC } from 'react';
import { VariantProps } from 'class-variance-authority';
import { switchStyles } from 'components/common/switch/switchStyles';

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
  ...props
}) => {
  return (
    <div
      className={switchStyles({ variant, size, isOn, class: className })}
      onClick={() => setIsOn(!isOn)}
      {...props}
    >
      <motion.div
        className={`aspect-square h-10 rounded-full ${
          isOn ? 'bg-white dark:bg-black' : 'bg-white/60'
        }`}
        layout
        transition={spring}
      />
    </div>
  );
};

const spring = {
  type: 'spring',
  mass: 0.6,
  stiffness: 700,
  damping: 30,
};
