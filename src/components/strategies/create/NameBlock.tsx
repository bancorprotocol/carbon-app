import { Tooltip } from 'components/common/tooltip';
import { FC } from 'react';

const maxLength = 35;

export const NameBlock: FC<{
  name: string;
  setName: (value: string) => void;
}> = ({ name, setName }) => {
  return (
    <div className={'bg-secondary space-y-10 rounded-10 p-20'}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8 text-18">
          Strategy Name
          <div className="text-secondary">Optional</div>
        </div>

        <Tooltip>A publicly descriptive name for your strategy</Tooltip>
      </div>

      <div className="bg-body rounded-16 p-16">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Eg. Carbon Strategy"
          maxLength={maxLength}
          className={'mb-8 w-full bg-transparent focus:outline-none'}
        />
        <div className="text-secondary !text-10">
          {name.length}/{maxLength} Characters Max
        </div>
      </div>
    </div>
  );
};
