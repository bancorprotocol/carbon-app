import { FC, useId } from 'react';
import { cn } from 'utils/helpers';
import style from './Preset.module.css';

export interface Preset {
  label: string;
  value: string;
}
interface Props {
  value: string;
  presets: Preset[];
  onChange: (value: string) => void;
  className?: string;
  testid?: string;
}

export const Presets: FC<Props> = (props) => {
  const { value, presets, onChange, className, testid } = props;
  const id = useId();
  const name = useId();
  return (
    <div role="radiogroup" className={cn('text-12 flex gap-8', className)}>
      {presets.map((preset) => (
        <div key={preset.value} className={style.preset}>
          <input
            type="radio"
            id={`${id}-${preset.value}`}
            name={name}
            value={preset.value}
            checked={preset.value === value}
            onChange={(e) => onChange(e.target.value)}
            data-testid={`${testid}-${preset.value}`}
          />
          <label htmlFor={`${id}-${preset.value}`}>{preset.label}</label>
        </div>
      ))}
    </div>
  );
};
