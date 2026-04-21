import { SafeDecimal } from 'libs/safedecimal';
import { Dispatch, FC, useEffect, useId, useMemo, useState } from 'react';
import { formatQuickTime } from './utils';
import { Warning } from 'components/common/WarningMessageWithIcon';

interface Props {
  deltaTime: string;
  setDeltaTime: Dispatch<string>;
}

export const QuickGradientDateRange: FC<Props> = (props) => {
  const { deltaTime, setDeltaTime } = props;
  const [localDelta, setLocalDelta] = useState(deltaTime);
  const endTimeId = useId();

  useEffect(() => {
    setLocalDelta(deltaTime);
  }, [deltaTime]);

  const dateError = useMemo(() => {
    const delta = Number(localDelta);
    if (delta < 1) return 'End time should be above 1min';
    if (delta > 60) return 'End time should be below 60min';
  }, [localDelta]);

  const updateDeltaTime = (value: string | number) => {
    if (!value) return setLocalDelta('');
    const time = new SafeDecimal(value);
    if (time.lt(1) || time.gt(60)) {
      setLocalDelta(time.toString());
    } else {
      setDeltaTime(value.toString());
      setLocalDelta(value.toString());
    }
  };

  return (
    <>
      <div className="text-12 font-medium flex gap-8 text-nowrap text-main-0/60">
        <div className="input-container rounded-s-2xl rounded-e-md flex flex-1 items-center gap-8 px-16 py-8">
          <span>Start Time</span>
          <span>On Execution</span>
        </div>
        <div className="input-container rounded-s-md rounded-e-2xl  flex flex-1 items-center gap-4">
          <label htmlFor={endTimeId}>End Time</label>
          <button
            type="button"
            className="text-success text-16 disabled:text-main-0/60"
            disabled={deltaTime === '1'}
            onClick={() => updateDeltaTime(Number(deltaTime) - 1)}
          >
            -
          </button>
          <input
            id={endTimeId}
            className="invalid:text-error w-[2ch] bg-transparent text-center text-main-0 focus-visible:outline-hidden"
            value={localDelta}
            onChange={(e) => updateDeltaTime(e.currentTarget.value)}
            type="number"
            min="1"
            max="60"
            step="1"
            autoComplete="off"
          />
          <span className="text-main-0">min</span>
          <span className="text-10 text-main-0">
            ({formatQuickTime(deltaTime)})
          </span>
          <button
            type="button"
            className="text-success text-16 disabled:text-main-0/60"
            disabled={deltaTime === '60'}
            onClick={() => updateDeltaTime(Number(deltaTime) + 1)}
          >
            +
          </button>
        </div>
      </div>
      {dateError && <Warning message={dateError} isError />}
    </>
  );
};
