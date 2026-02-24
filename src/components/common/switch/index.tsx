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
        <div
          className={cn(
            'aspect-square h-10 rounded-full outline-2',
            isOn
              ? 'bg-main-900 outline-black'
              : 'bg-main-0/60 outline-main-0/60',
            'peer-focus-visible:outline-solid',
          )}
        />
      </div>
    </>
  );
};
