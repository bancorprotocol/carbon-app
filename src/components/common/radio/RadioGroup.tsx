import { FC, ReactNode, useId } from 'react';
import style from './RadioGroup.module.css';

interface RadioGroupProps {
  className?: string;
  children: ReactNode;
}

export const RadioGroup: FC<RadioGroupProps> = ({ children }) => {
  return (
    <div
      role="group"
      className="text-14 relative flex items-center rounded-full bg-black p-2"
    >
      {children}
    </div>
  );
};

interface RadioProps {
  name?: string;
  value?: string;
  children: ReactNode;
  checked?: boolean;
  onChange?: (value?: string) => any;
  className?: string;
  'data-testid'?: string;
}

export const Radio: FC<RadioProps> = (props) => {
  const id = useId();
  return (
    <>
      <input
        id={id}
        type="radio"
        checked={props.checked}
        value={props.value}
        onChange={() => props.onChange?.(props.value)}
        className={style.radio}
        data-testid={props['data-testid']}
      />
      <label
        htmlFor={id}
        className="rounded-40 font-weight-500 cursor-pointer px-10 py-4 text-white/60 hover:text-white/80"
      >
        {props.children}
      </label>
    </>
  );
};
