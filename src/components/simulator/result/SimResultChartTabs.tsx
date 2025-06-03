import { Dispatch, SetStateAction } from 'react';
import { cn } from 'utils/helpers';
import { ReactComponent as IconAnimation } from 'assets/icons/movie.svg';
import { ReactComponent as IconSummary } from 'assets/icons/image.svg';

interface Props {
  showSummary: boolean;
  setShowSummary: Dispatch<SetStateAction<boolean>>;
}

export const SimResultChartTabs = ({ showSummary, setShowSummary }: Props) => {
  const tabs = [
    {
      label: 'animation',
      icon: <IconAnimation className="size-18" />,
      isActive: () => !showSummary,
      click: () => setShowSummary(false),
    },
    {
      label: 'summary',
      icon: <IconSummary className="size-18" />,
      isActive: () => showSummary,
      click: () => setShowSummary(true),
    },
  ];

  return (
    <nav
      aria-label="Simulation Tabs"
      className="border-background-900 text-14 flex h-40 w-full max-w-40 gap-2 rounded-full border-2 p-4 md:w-auto"
    >
      {tabs.map(({ label, icon, isActive, click }) => {
        const active = isActive();
        return (
          <button
            key={label}
            onClick={click}
            className={cn(
              'flex w-full items-center justify-center gap-4 rounded-full px-16 py-5',
              active ? 'bg-white/10' : 'bg-transparent text-white/60',
            )}
            data-testid={`chart-tab-${label}`}
          >
            {icon}
            <span className="text-14 font-weight-500 capitalize">{label}</span>
          </button>
        );
      })}
    </nav>
  );
};
