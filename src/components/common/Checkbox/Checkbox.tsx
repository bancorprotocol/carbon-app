import { FC } from 'react';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { cn } from 'utils/helpers';

type Props = JSX.IntrinsicElements['button'] & {
  isChecked: boolean;
  setIsChecked: (isChecked: boolean) => void;
};

export const Checkbox: FC<Props> = ({ isChecked, setIsChecked, ...attr }) => {
  const classNames =
    'size-18 rounded-4 flex items-center justify-center cursor-pointer';
  const borderBgColor = isChecked
    ? 'bg-gradient-to-r from-primaryGradient-first to-primaryGradient-middle'
    : ' border-2 ';

  return (
    <button
      {...attr}
      type="button"
      role="checkbox"
      aria-checked={isChecked}
      className={cn(`${classNames} ${borderBgColor}`, attr.className)}
      onClick={() => setIsChecked(!isChecked)}
    >
      {isChecked && <IconCheck className="text-background-900 size-10" />}
    </button>
  );
};
