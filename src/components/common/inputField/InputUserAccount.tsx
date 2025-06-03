import { Label, LabelProps } from 'components/common/inputField/Label';
import { Input, InputProps } from 'components/common/inputField/Input';
import { useMemo } from 'react';
import { utils } from 'ethers';

type Props = InputProps & Pick<LabelProps, 'label' | 'msg'>;

export const InputUserAccount = ({ label, msg, ...props }: Props) => {
  const isValid = useMemo(
    () => utils.isAddress(typeof props.value === 'string' ? props.value : ''),
    [props.value],
  );

  const labelMsg = useMemo(() => {
    if (!props.value) {
      return msg || '';
    }
    if (isValid) {
      return 'Valid';
    }
    return 'Invalid';
  }, [isValid, msg, props.value]);

  const variant = useMemo(() => {
    if (!props.value) {
      return;
    }
    if (isValid) {
      return 'success';
    }
    return 'error';
  }, [isValid, props.value]);

  return (
    <Label label={label} msg={labelMsg} variant={variant}>
      <Input fullWidth {...props} variant={variant} />
    </Label>
  );
};
