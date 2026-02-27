import { AriaRole, FC } from 'react';
import { cn } from 'utils/helpers';

interface Props {
  id?: string;
  className?: string;
  role?: AriaRole;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Switch: FC<Props> = ({
  className,
  checked,
  onChange,
  id,
  role,
}) => {
  return (
    <div
      role={role}
      className={cn(
        'relative bg-main-600 rounded-full w-40 p-4 hover:bg-main-500 has-[:checked]:bg-primary',
        className,
      )}
    >
      <input
        className="peer absolute inset-0 opacity-0 cursor-pointer"
        type="checkbox"
        checked={checked}
        id={id}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="aspect-square h-10 rounded-full peer-focus-visible:outline-solid bg-main-900 peer-checked:translate-x-20 transition-transform pointer-events-none" />
    </div>
  );
};
