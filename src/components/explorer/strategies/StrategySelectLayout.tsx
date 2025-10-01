import { Radio, RadioGroup } from 'components/common/radio/RadioGroup';
import { ReactComponent as IconGrid } from 'assets/icons/grid.svg';
import { ReactComponent as IconTable } from 'assets/icons/table.svg';
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
      className="hidden border-2 border-white/10 xl:flex"
    >
      <Radio
        name="layout"
        checked={layout !== 'table'}
        onChange={() => setLayout('grid')}
        aria-label="List"
      >
        <IconGrid className="size-20" />
      </Radio>
      <Radio
        name="layout"
        checked={layout === 'table'}
        onChange={() => setLayout('table')}
        aria-label="Table"
      >
        <IconTable className="size-20" />
      </Radio>
    </RadioGroup>
  );
};
