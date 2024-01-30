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
import { StrategyInput2 } from 'hooks/useStrategyInput';

interface Props extends Pick<SimulatorReturn, 'data'> {
  state2: StrategyInput2;
}

export const SimulatorDownloadMenu = ({ data, state2 }: Props) => {
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
        const csvOutput = data.map((item) => ({
          ...item,
          date: new Date(item.date * 1e3),
        }));
        const fileName = `${state2.baseToken?.symbol ?? ''}_${
          state2.quoteToken?.symbol ?? ''
        }_${state2.simulationType}`;
        CsvDataService.exportToCsv(fileName, csvOutput);
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
            'relative grid h-40 w-40 place-items-center border-silver py-11 px-0'
          )}
          onClick={(e) => {
            setIsOpen(true);
            attr.onClick(e);
          }}
          aria-label="Download Simulation"
        >
          <IconDownload className="h-18 w-18" />
        </button>
      )}
    >
      {items?.map(({ id, action, title, subTitle, icon }, index) => {
        return (
          <button
            key={`${index}_${id}`}
            role="menuitem"
            aria-labelledby="optionTitle"
            className="hover:bg-body flex w-full rounded-6 p-8 text-left"
            onClick={() => {
              action();
              setIsOpen(false);
            }}
          >
            <div className="flex items-center gap-8 text-14">
              {icon}
              <span id="optionTitle" className="font-weight-500">
                {title}
              </span>
              <span className="text-white/40">{subTitle}</span>
            </div>
          </button>
        );
      })}
    </DropdownMenu>
  );
};
