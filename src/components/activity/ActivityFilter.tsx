import { Activity } from 'libs/queries/extApi/activity';
import { mapOver } from 'utils/helpers/operators';
import { Token } from 'libs/tokens';
import { activityActionName } from './utils';
import { toPairSlug } from 'utils/pairSearch';
import { useList } from 'hooks/useList';
import { ChangeEvent } from 'react';

interface ActivityTokens {
  base: Token;
  quote: Token;
}

interface ActivitySearchParams {
  pair: string;
  strategyId: string;
  action: string;
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
  const {
    all: activities,
    searchParams,
    setSearchParams,
  } = useList<Activity, ActivitySearchParams>();

  const ids = idMap(activities);
  const pairs = pairMap(activities);
  const actions = Array.from(new Set(activities.map((a) => a.action)));

  const updateParams = (e: ChangeEvent<HTMLFormElement>) => {
    const data = new FormData(e.currentTarget);
    setSearchParams(Object.fromEntries(data.entries()));
  };

  return (
    <form
      className="flex flex-1 justify-end gap-8"
      role="search"
      onChange={updateParams}
    >
      <select
        name="strategyId"
        className="rounded-full border-2 border-background-800 bg-background-900 px-12 py-8"
      >
        <option key="empty" value="">
          Select a strategy
        </option>
        {mapOver(ids, ([key, { base, quote }]) => (
          <option key={key} value={key}>
            {base.symbol}/{quote.symbol}
          </option>
        ))}
      </select>
      <select
        name="pair"
        className="rounded-full border-2 border-background-800 bg-background-900 px-12 py-8"
      >
        <option key="empty" value="">
          Select a Pair
        </option>
        {mapOver(pairs, ([key, { base, quote }]) => (
          <option key={key} value={key}>
            {base.symbol}/{quote.symbol}
          </option>
        ))}
      </select>
      <select
        name="action"
        value={searchParams.action}
        className="rounded-full border-2 border-background-800 bg-background-900 px-12 py-8"
      >
        <option key="empty" value="">
          Select an Action
        </option>
        {actions.map((action) => (
          <option key={action} value={action}>
            {activityActionName[action]}
          </option>
        ))}
      </select>
    </form>
  );
};
