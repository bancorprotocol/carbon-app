import { useNavigate, useSearch } from '@tanstack/react-router';
import { Radio, RadioGroup } from 'components/common/radio/RadioGroup';
import { ReactComponent as IconGrid } from 'assets/icons/grid.svg';
import { ReactComponent as IconTable } from 'assets/icons/table.svg';
import { FC } from 'react';
import { lsService } from 'services/localeStorage';

export type StrategyLayout = 'grid' | 'table';

const urls = {
  explorer: '/explore/$slug/' as const,
  myStrategy: '/portfolio/' as const,
};
interface Props {
  from: keyof typeof urls;
}
export const StrategySelectLayout: FC<Props> = ({ from }) => {
  const config = { from: urls[from] };
  const { layout = lsService.getItem('strategyLayout') } = useSearch(config);
  const nav = useNavigate(config);
  const set = (layout: StrategyLayout) => {
    lsService.setItem('strategyLayout', layout);
    nav({ search: (s) => ({ ...s, layout }) });
  };
  return (
    <RadioGroup
      aria-label="Select strategy list layout"
      className="hidden border-2 border-white/10 xl:flex"
    >
      <Radio
        name="layout"
        checked={layout !== 'table'}
        onChange={() => set('grid')}
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
