import { DetailedHTMLProps, FC, HTMLAttributes, ReactNode, useId } from 'react';
import { cn } from 'utils/helpers';
import style from './RadioGroup.module.css';

type RadioGroupProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const RadioGroup: FC<RadioGroupProps> = ({ children, ...props }) => {
  return (
    <div
      role="radiogroup"
      {...props}
      className={cn(
        'text-14 relative flex items-center rounded-full bg-main-900/40 p-4',
        props.className,
        style.radioGroup,
      )}
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
  defaultChecked?: boolean;
  onChange?: (value?: string) => any;
  className?: string;
  'data-testid'?: string;
  'aria-label'?: string;
}

export const Radio: FC<RadioProps> = (props) => {
  const id = useId();
  return (
    <>
      <label
        htmlFor={id}
        data-testid={props['data-testid']}
        className={cn(
          'rounded-full font-medium cursor-pointer px-12 py-6 text-main-0/60 hover:bg-main-600/20',
          props.className,
          style.label,
        )}
      >
        <input
          id={id}
          type="radio"
          checked={props.checked}
          defaultChecked={props.defaultChecked}
          value={props.value}
          name={props.name}
          onChange={() => props.onChange?.(props.value)}
          className={cn(style.radio, 'peer/radio')}
          aria-label={props['aria-label']}
        />
        {props.children}
      </label>
    </>
  );
};
