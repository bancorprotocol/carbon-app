import { Radio, RadioGroup } from 'components/common/radio/RadioGroup';
import ViewComfyAltIcon from 'assets/icons/view_comfy_alt.svg?react';
import ListIcon from 'assets/icons/list.svg?react';
import { Dispatch, FC, SetStateAction } from 'react';

export type StrategyLayout = 'grid' | 'table';

interface Props {
  layout: StrategyLayout;
  setLayout: Dispatch<SetStateAction<StrategyLayout>>;
}
export const StrategySelectLayout: FC<Props> = ({ layout, setLayout }) => {
  return (
    <RadioGroup
      aria-label="Select strategy list layout"
      className="hidden xl:flex"
    >
      <Radio
        name="layout"
        checked={layout !== 'table'}
        onChange={() => setLayout('grid')}
        aria-label="List"
      >
        <ViewComfyAltIcon className="size-24" />
      </Radio>
      <Radio
        name="layout"
        checked={layout === 'table'}
        onChange={() => setLayout('table')}
        aria-label="Table"
      >
        <ListIcon className="size-24" />
      </Radio>
    </RadioGroup>
  );
};
