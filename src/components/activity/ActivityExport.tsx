import { Activity } from 'libs/queries/extApi/activity';
import { FC, useMemo } from 'react';
import { activityActionName } from './utils';
import { getLowestBits } from 'utils/helpers';
import { ReactComponent as IconDownloadFile } from 'assets/icons/download-file.svg';

const getCSV = (activities: Activity[]) => {
  const header = [
    'ID',
    'Strategy NFT ID',
    'Base',
    'Quote',
    'Action',
    'Buy Min',
    'Buy Max',
    'Buy Budget',
    'Sell Min',
    'Sell Max',
    'Sell Budget',
    'Buy Min Changes',
    'Buy Max Changes',
    'Buy Budget Changes',
    'Sell Min Changes',
    'Sell Max Changes',
    'Sell Budget Changes',
    'Block Number',
    'Transaction Hash',
    'Date',
  ].join(',');

  const body = activities.map((activity) => {
    const { strategy, changes, blockNumber, txHash } = activity;
    const { base, quote } = strategy;
    const date = new Date(activity.date).toLocaleDateString();
    return [
      getLowestBits(strategy.id),
      strategy.id,
      base.symbol,
      quote.symbol,
      activityActionName[activity.action],
      strategy.buy.min,
      strategy.buy.max,
      strategy.buy.budget,
      strategy.sell.min,
      strategy.sell.max,
      strategy.sell.budget,
      changes?.buy?.min ?? '',
      changes?.buy?.max ?? '',
      changes?.buy?.budget ?? '',
      changes?.sell?.min ?? '',
      changes?.sell?.max ?? '',
      changes?.sell?.budget ?? '',
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

interface Props {
  activities: Activity[];
}
export const ActivityExport: FC<Props> = ({ activities }) => {
  const csvURI = useMemo(() => getCSV(activities), [activities]);
  return (
    <a
      href={csvURI}
      className="border-background-800 text-12 hover:border-background-700 hover:bg-background-800 flex items-center gap-8 rounded-full border-2 px-12 py-8"
      download="activities.csv"
    >
      <IconDownloadFile className="text-primary size-14" />
      <span>Export</span>
    </a>
  );
};
