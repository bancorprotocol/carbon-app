import { Activity } from 'libs/queries/extApi/activity';
import { ActivityTable } from './ActivityTable';
import { ActivityFilter, ActivityFilterProps } from './ActivityFilter';
import { useList } from 'hooks/useList';
import { FC, useMemo } from 'react';
import { ReactComponent as IconDownloadFile } from 'assets/icons/download-file.svg';
import { ActivityCountDown, useCountDown } from './ActivityCountDown';
import { activityActionName, activityDescription } from './utils';
import { getLowestBits } from 'utils/helpers';

const formatter = Intl.NumberFormat('en');
const getCSV = (activities: Activity[]) => {
  const header = [
    'ID',
    'Base',
    'Quote',
    'Action',
    'Description',
    'Buy Budget',
    'Buy Budget Changes',
    'Sell Budget',
    'Sell Budget Changes',
    'Block Number',
    'Transaction Hash',
    'Date',
  ].join(',');
  const body = activities.map((activity) => {
    const { strategy, changes, blockNumber, txHash } = activity;
    const { base, quote } = strategy;
    const description = activityDescription(activity);
    const date = new Date(activity.date).toUTCString();
    return [
      getLowestBits(strategy.id),
      base.symbol,
      quote.symbol,
      activityActionName[activity.action],
      description,
      `${formatter.format(+strategy.buy.budget)} ${base.symbol}`,
      changes?.buy?.budget
        ? `${formatter.format(+changes.buy.budget)} ${base.symbol}`
        : '',
      `${formatter.format(+strategy.sell.budget)} ${quote.symbol}`,
      changes?.sell?.budget
        ? `${formatter.format(+changes.sell.budget)} ${quote.symbol}`
        : '',
      blockNumber,
      txHash,
      date,
    ]
      .map((v) => `"${v}"`) // Ignore inner comma
      .join(',');
  });
  const csv = [header].concat(body).join('\n');
  const csvContent = `data:text/csv;charset=utf-8,${csv}`;
  return encodeURI(csvContent);
};

export const ActivitySection: FC<ActivityFilterProps> = ({ filters = [] }) => {
  const { list: activities, all: allActivities } = useList<Activity>();
  const count = useCountDown(30, [allActivities]);
  const csvURI = useMemo(() => getCSV(allActivities), [allActivities]);
  return (
    <section className="rounded bg-background-900">
      <header className="flex items-center gap-16 px-20 py-24">
        <h2>Activity</h2>
        <ActivityFilter filters={filters} />
        <a
          href={csvURI}
          className="flex items-center gap-8 rounded-full border-2 border-background-800 px-12 py-8 text-12 hover:border-background-700 hover:bg-background-800"
          download="activities.csv"
        >
          <IconDownloadFile className="h-14 w-14 text-primary" />
          <span>Export</span>
        </a>
        <ActivityCountDown time={10} count={count} />
      </header>
      <ActivityTable
        activities={activities}
        hideIds={!filters.includes('ids')}
      />
    </section>
  );
};
