import { Dispatch, FC, useId, useMemo, useState } from 'react';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { DropdownMenu } from 'components/common/dropdownMenu';
import KeyboardArrowDownIcon from 'assets/icons/keyboard_arrow_down.svg?react';

interface Props {
  deltaTime: string;
  setDeltaTime: Dispatch<string>;
}

const minutes = new Array(60).fill(null).map((_, i) => (i + 1).toString());

export const QuickGradientDateRange: FC<Props> = (props) => {
  const { deltaTime, setDeltaTime } = props;
  const endTimeId = useId();

  const [open, setOpen] = useState(false);

  const dateError = useMemo(() => {
    const delta = Number(deltaTime);
    if (delta < 1) return 'End time should be above 1min';
    if (delta > 60) return 'End time should be below 60min';
  }, [deltaTime]);

  const setDelta = (value: string) => {
    setDeltaTime(value);
    setOpen(false);
  };

  return (
    <>
      <div className="text-12 font-medium flex gap-8 text-nowrap text-main-0/60">
        <div className="input-container rounded-s-2xl rounded-e-md flex flex-1 items-center gap-8 px-16 py-8">
          <span>Start Time</span>
          <span>On Execution</span>
        </div>
        <DropdownMenu
          isOpen={open}
          setIsOpen={setOpen}
          className="grid p-8 max-h-350 overflow-auto"
          button={(attr) => (
            <button
              type="button"
              className="input-container rounded-s-md rounded-e-2xl  flex flex-1 items-center gap-4"
              {...attr}
            >
              <label htmlFor={endTimeId}>End Time</label>
              <div className="flex items-center gap-8 w-full text-main-0">
                <span className="flex-1 text-center">{deltaTime}min</span>
                <KeyboardArrowDownIcon className="text-primary size-24" />
              </div>
            </button>
          )}
        >
          {minutes.map((delta) => (
            <button
              key={delta}
              type="button"
              role="menuitemradio"
              aria-selected={delta === deltaTime}
              className="rounded-sm flex w-full items-center gap-8 p-12 hover:bg-main-900/40 aria-selected:bg-main-900/60"
              onClick={() => setDelta(delta)}
            >
              {delta}min
            </button>
          ))}
        </DropdownMenu>
      </div>
      {dateError && <Warning message={dateError} isError />}
    </>
  );
};
