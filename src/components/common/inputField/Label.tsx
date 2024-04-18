import { DetailedHTMLProps, FC, LabelHTMLAttributes } from 'react';
import { labelStyles } from 'components/common/inputField/labelStyles';
import { VariantProps } from 'class-variance-authority';
import { cn } from 'utils/helpers';

type LabelHTMLProps = DetailedHTMLProps<
  LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
>;

export interface LabelProps extends LabelHTMLProps {
  label?: string;
  msg?: string;
}

export const Label: FC<LabelProps & VariantProps<typeof labelStyles>> = ({
  children,
  label,
  msg,
  ...props
}) => {
  return (
    <label className="w-full" {...props}>
      {(label || msg) && (
        <div className="mb-10 flex justify-between">
          <div>{label}</div>
          <div className={cn(labelStyles({ variant: props.variant }))}>
            {msg}
          </div>
        </div>
      )}
      {children}
    </label>
  );
};
