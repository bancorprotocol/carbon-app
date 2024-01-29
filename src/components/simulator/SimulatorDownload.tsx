import { cn } from 'utils/helpers';
import { ReactComponent as IconLog } from 'assets/icons/page.svg';
import { ReactComponent as IconAnimation } from 'assets/icons/movie.svg';
import { ReactComponent as IconSummary } from 'assets/icons/image.svg';
import { ReactComponent as IconDownload } from 'assets/icons/download.svg';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { useState } from 'react';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { SimulatorReturn } from 'libs/queries';
import { CsvDataService } from 'libs/csv';

interface Props extends Pick<SimulatorReturn, 'data'> {}

export const SimulatorDownloadMenu = ({ data }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const items = [
    {
      id: 'summaryView',
      title: 'Summary View',
      subTitle: 'JPEG',
      action: () => console.log('Summary View'),
      icon: <IconSummary className="h-20 w-20" />,
    },
    {
      id: 'animation' as const,
      title: 'Animation',
      subTitle: 'GIF',
      action: () => console.log('Animation'),
      icon: <IconAnimation className="h-20 w-20" />,
    },
    {
      id: 'simulationLog' as const,
      title: 'Simulation Log',
      subTitle: 'CSV',
      action: () => {
        const csvOutput = data.map((item) => {
          return {
            ...item,
            date: new Date(item.date * 1e3),
          };
        });
        CsvDataService.exportToCsv('data.csv', csvOutput);
      },
      icon: <IconLog className="h-20 w-20" />,
    },
  ];

  return (
    <DropdownMenu
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      placement="bottom-end"
      className="rounded-[10px] !border-0 p-8 text-white"
      aria-expanded={isOpen}
      button={(attr) => (
        <button
          {...attr}
          className={cn(
            buttonStyles({ variant: 'black' }),
            'relative h-40 w-40 border-silver !p-0'
          )}
          onClick={(e) => {
            setIsOpen(true);
            attr.onClick(e);
          }}
          aria-label="Download Simulation"
        >
          <span className="flex h-36 w-36 items-center justify-center">
            <IconDownload className="h-18 w-18" />
          </span>
        </button>
      )}
    >
      {items?.map(({ id, action, title, subTitle, icon }, index) => {
        return (
          <div key={`${index}_${id}`} className="border-grey5">
            <button
              role="menuitem"
              aria-labelledby="optionTitle"
              className="hover:bg-body w-full rounded-6 p-8 text-left"
              onClick={() => {
                action();
                setIsOpen(false);
              }}
            >
              <div className="flex items-center gap-y-8">
                {icon}
                <span id="optionTitle" className="mx-8 text-14 font-weight-500">
                  {title}
                </span>
                <span className="text-14 font-weight-400 text-white/40">
                  {subTitle}
                </span>
              </div>
            </button>
          </div>
        );
      })}
    </DropdownMenu>
  );
};
