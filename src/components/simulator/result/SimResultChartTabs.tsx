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
      label: 'Animation',
      icon: <IconAnimation className="h-18 w-18" />,
      isActive: () => !showSummary,
      click: () => setShowSummary(false),
    },
    {
      label: 'Summary',
      icon: <IconSummary className="h-18 w-18" />,
      isActive: () => showSummary,
      click: () => setShowSummary(true),
    },
  ];

  return (
    <nav
      aria-label="Simulation Tabs"
      className="max-w-40 flex h-40 w-full gap-2 rounded-full border-2 border-silver p-4 text-14 md:w-auto"
    >
      {tabs.map(({ label, icon, isActive, click }) => {
        const active = isActive();
        return (
          <button
            key={label}
            onClick={click}
            className={cn(
              'flex w-full items-center justify-center gap-4 rounded-full py-5 px-16',
              active ? 'bg-white/10' : 'bg-transparent text-white/60'
            )}
          >
            {icon}
            <span className="text-14 font-weight-500">{label}</span>
          </button>
        );
      })}
    </nav>
  );
};
