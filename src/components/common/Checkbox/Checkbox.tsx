import { FC } from 'react';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { cn } from 'utils/helpers';

type Props = JSX.IntrinsicElements['button'] & {
  isChecked: boolean;
  setIsChecked: (isChecked: boolean) => void;
};

export const Checkbox: FC<Props> = ({ isChecked, setIsChecked, ...attr }) => {
  const classNames =
    'h-18 w-18 rounded-4 border-2 flex items-center justify-center cursor-pointer';
  const borderColor = isChecked ? 'border-green bg-green' : 'border-white/60';

  return (
    <button
      {...attr}
      type="button"
      className={cn(`${classNames} ${borderColor}`, attr.className)}
      onClick={() => setIsChecked(!isChecked)}
    >
      {isChecked && <IconCheck className="h-10 w-10 text-silver" />}
    </button>
  );
};
