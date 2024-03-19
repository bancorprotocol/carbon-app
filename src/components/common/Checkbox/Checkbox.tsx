import { FC } from 'react';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { cn } from 'utils/helpers';

type Props = JSX.IntrinsicElements['button'] & {
  isChecked: boolean;
  setIsChecked: (isChecked: boolean) => void;
};

export const Checkbox: FC<Props> = ({ isChecked, setIsChecked, ...attr }) => {
  const classNames =
    'size-18 rounded-4 border-2 flex items-center justify-center cursor-pointer';
  const borderColor = isChecked
    ? 'border-primary bg-primary'
    : 'border-white/60';

  return (
    <button
      {...attr}
      type="button"
      className={cn(`${classNames} ${borderColor}`, attr.className)}
      onClick={() => setIsChecked(!isChecked)}
    >
      {isChecked && <IconCheck className="text-background-900 size-10" />}
    </button>
  );
};
