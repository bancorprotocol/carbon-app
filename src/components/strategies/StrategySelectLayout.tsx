import { useNavigate, useSearch } from '@tanstack/react-router';
import { Radio, RadioGroup } from 'components/common/radio/RadioGroup';
import { ReactComponent as IconGrid } from 'assets/icons/grid.svg';
import { ReactComponent as IconTable } from 'assets/icons/table.svg';
import { FC } from 'react';

const urls = {
  explorer: '/explore/$type/$slug/' as const,
  myStrategy: '/my-strategy-layout/' as const,
};
interface Props {
  from: keyof typeof urls;
}
export const StrategySelectLayout: FC<Props> = ({ from }) => {
  const { layout } = useSearch({ from: urls[from] });
  const nav = useNavigate({ from: urls[from] });
  const set = (layout: 'list' | 'table') => {
    nav({ search: (s) => ({ ...s, layout }) });
  };
  return (
    <RadioGroup
      aria-label="Select strategy list layout"
      className="border-2 border-white/10"
    >
      <Radio
        name="layout"
        checked={layout !== 'table'}
        onChange={() => set('list')}
        aria-label="List"
      >
        <IconGrid className="size-20" />
      </Radio>
      <Radio
        name="layout"
        checked={layout === 'table'}
        onChange={() => set('table')}
        aria-label="Table"
      >
        <IconTable className="size-20" />
      </Radio>
    </RadioGroup>
  );
};
