import { Activity } from 'libs/queries/extApi/activity';
import { Token } from 'libs/tokens';
import { activityActionName } from './utils';
import { toPairSlug } from 'utils/pairSearch';
import { FC, useId } from 'react';
import { Combobox, Option } from 'components/common/combobox';
import { cn, getLowestBits } from 'utils/helpers';
import { ReactComponent as IconSearch } from 'assets/icons/search.svg';
import { ReactComponent as IconPair } from 'assets/icons/token-pair.svg';
import { TokensOverlap } from 'components/common/tokensOverlap';
import {
  DateRangePicker,
  datePickerPresets,
} from 'components/common/datePicker/DateRangePicker';
import { useActivity } from './ActivityProvider';

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
export interface ActivityFilterProps {
  filters?: ('ids' | 'pairs')[];
  className?: string;
}
export const ActivityFilter: FC<ActivityFilterProps> = (props) => {
  const { filters = [], className } = props;
  const formId = useId();
  const { all: activities, searchParams, setSearchParams } = useActivity();

  const allIds = getAllIds(activities);
  const allPairs = getAllPairs(activities);
  const allActions = Array.from(
    new Set(activities.map((a) => a.action))
  ).sort();

  const { pairs, ids, actions, start, end } = searchParams;

  const updateParams = () => {
    const selector = `input[form="${formId}"]`;
    const inputs = document.querySelectorAll<HTMLInputElement>(selector);
    const params: Record<string, string[] | string> = {};
    for (const input of inputs) {
      const name = input.name;
      if (input.type === 'checkbox') {
        params[name] ||= [];
        if (input.checked) (params[name] as string[]).push(input.value);
      } else {
        params[name] = input.value;
      }
    }
    setSearchParams(params);
  };

  return (
    <form
      id={formId}
      className={cn(
        'flex flex-wrap items-center justify-start gap-8 md:justify-end md:gap-16',
        className
      )}
      role="search"
      onChange={updateParams}
    >
      {filters.includes('ids') && (
        <Combobox
          form={formId}
          name="ids"
          value={ids}
          icon={<IconSearch className="w-14 text-primary" />}
          label={
            ids.length
              ? `${ids.length} Strategies Selected`
              : 'Filter Strategies'
          }
          filterLabel="Search by ID or Symbol"
          options={allIds.map(({ id, base, quote }) => (
            <Option key={id} value={id}>
              <span>{id}</span>
              <svg width="4" height="4">
                <circle cx="2" cy="2" r="2" fill="white" fillOpacity="0.4" />
              </svg>
              <span className="text-white/40">
                {base.symbol}/{quote.symbol}
              </span>
            </Option>
          ))}
        />
      )}
      {filters.includes('pairs') && (
        <Combobox
          form={formId}
          name="pairs"
          value={pairs}
          icon={<IconPair className="w-14 text-primary" />}
          label={
            pairs.length ? `${pairs.length} Pairs Selected` : 'Filter Pairs'
          }
          filterLabel="Search by Pair"
          options={allPairs.map(({ pair, base, quote }) => (
            <Option key={pair} value={pair}>
              <TokensOverlap tokens={[base, quote]} size={14} />
              {base.symbol}/{quote.symbol}
            </Option>
          ))}
        />
      )}
      <Combobox
        form={formId}
        name="actions"
        value={actions}
        icon={<IconSearch className="w-14 text-primary" />}
        label={
          actions.length
            ? `${actions.length} Actions Selected`
            : 'Filter Actions'
        }
        filterLabel="Search by Action"
        options={allActions.map((action) => (
          <Option key={action} value={action}>
            {activityActionName[action]}
          </Option>
        ))}
      />
      <DateRangePicker
        form={formId}
        presets={datePickerPresets}
        onConfirm={updateParams}
        start={start}
        end={end}
        options={{
          disabled: { after: new Date() },
        }}
      />
    </form>
  );
};
