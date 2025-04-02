import { ChangeEvent, FC, useId } from 'react';
import style from './Preset.module.css';

export interface Preset {
  label: string;
  value: string;
}
interface Props {
  presets: Preset[];
  value?: string;
  onChange: (value: string) => void;
}

export const Presets: FC<Props> = (props) => {
  const { presets, value, onChange } = props;
  const name = useId();
  const change = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.currentTarget.value);
  };
  return (
    <div role="radiogroup" className="flex gap-8">
      {presets.map((preset, i) => (
        <label key={i} className={style.preset}>
          <input
            type="radio"
            name={name}
            value={preset.value}
            onChange={change}
            checked={value === preset.value}
          />
          {preset.label}
        </label>
      ))}
    </div>
  );
};
