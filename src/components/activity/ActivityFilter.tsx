import { Activity } from 'libs/queries/extApi/activity';
import { mapOver } from 'utils/helpers/operators';
import { Token } from 'libs/tokens';
import { activityActionName } from './utils';
import { toPairSlug } from 'utils/pairSearch';
import { useList } from 'hooks/useList';
import { useId } from 'react';
import { Combobox, Listbox, Option } from 'components/common/combobox';
import { getLowestBits } from 'utils/helpers';
import { ReactComponent as IconSearch } from 'assets/icons/search.svg';
import { ReactComponent as IconPair } from 'assets/icons/token-pair.svg';

interface ActivityTokens {
  base: Token;
  quote: Token;
}

interface ActivitySearchParams {
  pair: string[];
  strategyId: string[];
  action: string[];
}

const idMap = (activity: Activity[]) => {
  return new Map<string, ActivityTokens>(
    activity.map(({ strategy }) => [
      strategy.id,
      { base: strategy.base, quote: strategy.quote },
    ])
  );
};
const pairMap = (activity: Activity[]) => {
  return new Map<string, ActivityTokens>(
    activity.map(({ strategy }) => [
      toPairSlug(strategy.base, strategy.quote),
      { base: strategy.base, quote: strategy.quote },
    ])
  );
};
export const ActivityFilter = () => {
  const formId = useId();
  const {
    all: activities,
    searchParams,
    setSearchParams,
  } = useList<Activity, ActivitySearchParams>();

  const allIds = idMap(activities);
  const allPairs = pairMap(activities);
  const allActions = Array.from(new Set(activities.map((a) => a.action)));

  console.log(searchParams);
  const { pair, strategyId, action } = searchParams;
  // const strategyIds = searchParams.strategyId?.split(',') ?? [];
  // const pairs = searchParams.pair?.split(',') ?? [];
  // const actions = searchParams.action?.split(',') ?? [];

  const updateParams = () => {
    const selector = `input[type="checkbox"][form="${formId}"]:checked`;
    const checkboxes = document.querySelectorAll<HTMLInputElement>(selector);
    const params: Record<string, FormDataEntryValue[]> = {};
    for (const checkbox of checkboxes) {
      const name = checkbox.name;
      params[name] ||= [];
      params[name].push(checkbox.value);
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
        name="strategyId"
        value={strategyId ?? []}
        icon={<IconSearch className="w-14 text-primary" />}
        label={
          strategyId?.length
            ? `${strategyId.length} Strategies Selected`
            : 'Select Strategies'
        }
        filterLabel="Search by ID"
        listbox={
          <Listbox>
            {mapOver(allIds, ([key, { base, quote }]) => (
              <Option key={key} value={getLowestBits(key)}>
                {getLowestBits(key)} - {base.symbol}/{quote.symbol}
              </Option>
            ))}
          </Listbox>
        }
      />
      <Combobox
        form={formId}
        name="pair"
        value={pair ?? []}
        icon={<IconPair className="w-14 text-primary" />}
        label={pair?.length ? `${pair?.length} Pairs Selected` : 'Select Pair'}
        filterLabel="Search by Pair"
        listbox={
          <Listbox>
            {mapOver(allPairs, ([key, { base, quote }]) => (
              <Option key={key} value={key}>
                {base.symbol}/{quote.symbol}
              </Option>
            ))}
          </Listbox>
        }
      />
      <Combobox
        form={formId}
        name="action"
        value={action ?? []}
        icon={<IconSearch className="w-14 text-primary" />}
        label={
          action?.length
            ? `${action.length} Actions Selected`
            : 'Select Actions'
        }
        filterLabel="Search by Action"
        listbox={
          <Listbox>
            {allActions.map((action) => (
              <Option key={action} value={action}>
                {activityActionName[action]}
              </Option>
            ))}
          </Listbox>
        }
      />
    </form>
  );
};
