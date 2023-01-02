import { DetailedHTMLProps, FC, LabelHTMLAttributes } from 'react';
import { labelStyles } from 'components/inputField/labelStyles';
import { VariantProps } from 'class-variance-authority';

type LabelHTMLProps = DetailedHTMLProps<
  LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
>;

export interface LabelProps extends LabelHTMLProps {
  label?: string;
  msg?: string;
  msgType?: 'success' | 'error';
}

export const Label: FC<LabelProps & VariantProps<typeof labelStyles>> = ({
  children,
  label,
  msg,
  msgType,
  ...props
}) => {
  return (
    <label className={'w-full'} {...props}>
      {(label || msg) && (
        <div className={'mb-10 flex justify-between'}>
          <div>{label}</div>
          <div className={labelStyles({ variant: props.variant })}>{msg}</div>
        </div>
      )}
      {children}
    </label>
  );
};
