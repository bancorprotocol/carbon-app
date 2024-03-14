import { Activity } from 'libs/queries/extApi/activity';
import { Token } from 'libs/tokens';
import { ActivitySearchParams, activityActionName } from './utils';
import { toPairSlug } from 'utils/pairSearch';
import { useList } from 'hooks/useList';
import { useId } from 'react';
import { Combobox, Option } from 'components/common/combobox';
import { getLowestBits } from 'utils/helpers';
import { ReactComponent as IconSearch } from 'assets/icons/search.svg';
import { ReactComponent as IconPair } from 'assets/icons/token-pair.svg';
import { TokensOverlap } from 'components/common/tokensOverlap';

interface DisplayID {
  id: string;
  base: Token;
  quote: Token;
}
interface DisplayPair {
  pair: string;
  base: Token;
  quote: Token;
}

const getAllIds = (activities: Activity[]) => {
  const map = new Map<string, DisplayID>();
  for (const activity of activities) {
    const { base, quote } = activity.strategy;
    const id = getLowestBits(activity.strategy.id);
    map.set(id, { id, base, quote });
  }
  return Array.from(map.values());
};
const getAllPairs = (activities: Activity[]) => {
  const map = new Map<string, DisplayPair>();
  for (const activity of activities) {
    const { base, quote } = activity.strategy;
    const pair = toPairSlug(base, quote);
    map.set(pair, { pair, base, quote });
  }
  return Array.from(map.values());
};
export const ActivityFilter = () => {
  const formId = useId();
  const {
    all: activities,
    searchParams,
    setSearchParams,
  } = useList<Activity, ActivitySearchParams>();

  const allIds = getAllIds(activities);
  const allPairs = getAllPairs(activities);
  const allActions = Array.from(new Set(activities.map((a) => a.action)));

  const { pairs, strategyIds, actions } = searchParams;

  const updateParams = () => {
    const selector = `input[type="checkbox"][form="${formId}"]`;
    const checkboxes = document.querySelectorAll<HTMLInputElement>(selector);
    const params: Record<string, string[]> = {};
    for (const checkbox of checkboxes) {
      const name = checkbox.name;
      params[name] ||= [];
      if (checkbox.checked) params[name].push(checkbox.value);
    }
    setSearchParams(params);
  };

  return (
    <form
      className="flex flex-1 justify-end gap-8"
      role="search"
      onChange={updateParams}
    >
      <Combobox
        form={formId}
        name="strategyIds"
        value={strategyIds}
        icon={<IconSearch className="w-14 text-primary" />}
        label={
          strategyIds.length
            ? `${strategyIds.length} Strategies Selected`
            : 'Select Strategies'
        }
        filterLabel="Search by ID or Symbol"
        options={allIds.map(({ id, base, quote }) => (
          <Option key={id} value={id}>
            {id} - {base.symbol}/{quote.symbol}
          </Option>
        ))}
      />
      <Combobox
        form={formId}
        name="pairs"
        value={pairs}
        icon={<IconPair className="w-14 text-primary" />}
        label={pairs.length ? `${pairs.length} Pairs Selected` : 'Select Pair'}
        filterLabel="Search by Pair"
        options={allPairs.map(({ pair, base, quote }) => (
          <Option key={pair} value={pair}>
            <TokensOverlap tokens={[base, quote]} className="h-14" />
            {base.symbol}/{quote.symbol}
          </Option>
        ))}
      />
      <Combobox
        form={formId}
        name="actions"
        value={actions}
        icon={<IconSearch className="w-14 text-primary" />}
        label={
          actions.length
            ? `${actions.length} Actions Selected`
            : 'Select Actions'
        }
        filterLabel="Search by Action"
        options={allActions.map((action) => (
          <Option key={action} value={action}>
            {activityActionName[action]}
          </Option>
        ))}
      />
    </form>
  );
};
