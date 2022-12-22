import { Tooltip } from 'components/Tooltip';
import { FC } from 'react';

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

        <Tooltip>??????</Tooltip>
      </div>

      <div className="bg-body rounded-16 p-16">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Eg. Carbon Strategy"
          maxLength={32}
          className={'mb-8 w-full bg-transparent focus:outline-none'}
        />
        <div className="text-secondary !text-10">32 Characters Max</div>
      </div>
    </div>
  );
};
