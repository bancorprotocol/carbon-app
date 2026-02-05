import { Radio, RadioGroup } from 'components/common/radio/RadioGroup';
import { useState } from 'react';
import IconLightTheme from 'assets/icons/light-theme.svg?react';
import IconSystemTheme from 'assets/icons/system-theme.svg?react';
import IconDarkTheme from 'assets/icons/dark-theme.svg?react';

const themes = {
  dark: <IconDarkTheme className="size-20" />,
  system: <IconSystemTheme className="size-20" />,
  light: <IconLightTheme className="size-20" />,
};

type Theme = keyof typeof themes;

// Theme is stored on the <html> element
// Its initial value is read in a blocking script to prevent flash
// Then it's all managed from this component
export const ThemePicker = () => {
  const [theme, setTheme] = useState(document.documentElement.dataset.theme);
  const saveTheme = (value: Theme) => {
    setTheme(value);
    document.documentElement.dataset.theme = value;
    localStorage.setItem('theme', value);
  };

  return (
    <RadioGroup className="grid grid-flow-col place-items-stretch">
      {Object.entries(themes).map(([key, icon]) => (
        <Radio
          className="grid place-items-center"
          key={key}
          name="theme"
          value={key}
          checked={theme === key}
          onChange={() => saveTheme(key as Theme)}
        >
          {icon}
        </Radio>
      ))}
    </RadioGroup>
  );
};
