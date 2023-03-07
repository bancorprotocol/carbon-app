import { FC } from 'react';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';

type Props = {
  isChecked: boolean;
  setIsChecked: (isChecked: boolean) => void;
};

export const Checkbox: FC<Props> = ({ isChecked, setIsChecked }) => {
  const classNames =
    'h-18 w-18 rounded-4 border-2 flex items-center justify-center cursor-pointer';
  const borderColor = isChecked ? 'border-green bg-green' : 'border-black';

  return (
    <div
      className={`${classNames} ${borderColor}`}
      onClick={() => setIsChecked(!isChecked)}
    >
      {isChecked && <IconCheck className="h-10 w-10 text-silver" />}
    </div>
  );
};
