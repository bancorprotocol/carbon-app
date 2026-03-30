import { Dispatch, SetStateAction } from 'react';
import TheatersIcon from 'assets/icons/theaters.svg?react';
import ImageIcon from 'assets/icons/image.svg?react';
import { Radio, RadioGroup } from 'components/common/radio/RadioGroup';

interface Props {
  showSummary: boolean;
  setShowSummary: Dispatch<SetStateAction<boolean>>;
}

export const SimResultChartTabs = ({ showSummary, setShowSummary }: Props) => {
  const tabs = [
    {
      label: 'animation',
      icon: <TheatersIcon className="size-24" />,
      isActive: () => !showSummary,
      click: () => setShowSummary(false),
    },
    {
      label: 'summary',
      icon: <ImageIcon className="size-24" />,
      isActive: () => showSummary,
      click: () => setShowSummary(true),
    },
  ];

  return (
    <RadioGroup aria-label="Simulation Tabs">
      {tabs.map(({ label, icon, isActive, click }) => {
        const active = isActive();
        return (
          <Radio
            key={label}
            name="sim-tab"
            value={label}
            checked={active}
            onChange={click}
            className="inline-flex items-center gap-8"
            data-testid={`chart-tab-${label}`}
          >
            {icon}
            <span className="text-14 font-medium capitalize">{label}</span>
          </Radio>
        );
      })}
    </RadioGroup>
  );
};
