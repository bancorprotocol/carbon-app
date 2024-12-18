import { Activity } from 'libs/queries/extApi/activity';
import { activityActionName } from './utils';
import { getLowestBits } from 'utils/helpers';
import { ReactComponent as IconDownloadFile } from 'assets/icons/download-file.svg';
import { useActivity } from './ActivityProvider';
import { carbonApi } from 'utils/carbonApi';
import { useTokens } from 'hooks/useTokens';
import { toActivities } from './useActivityQuery';
import { MouseEvent, useRef, useState } from 'react';
import { Button } from 'components/common/button';

export const getActivityCSV = (activities: Activity[]) => {
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

const limit = 10_000;
export const ActivityExport = () => {
  const ref = useRef<HTMLDialogElement>(null);
  const [loading, setLoading] = useState(false);
  const { queryParams, size } = useActivity();
  const { tokensMap } = useTokens();

  const close = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target !== e.currentTarget) return;
    e.currentTarget.close();
  };

  const download = async () => {
    setLoading(true);
    const data = await carbonApi.getActivity({
      ...queryParams,
      offset: 0,
      limit,
    });
    const activities = toActivities(data, tokensMap);
    const anchor = document.createElement('a');
    anchor.href = getActivityCSV(activities);
    anchor.download = 'activities.csv';
    anchor.click();
    setLoading(false);
  };

  const shouldDownload = () => {
    if (size && size > limit) ref.current?.showModal();
    else download();
  };

  return (
    <>
      <button
        type="button"
        onClick={shouldDownload}
        disabled={loading}
        className="border-background-800 text-12 hover:border-background-700 hover:bg-background-800 flex items-center gap-8 rounded-full border-2 px-12 py-8 disabled:pointer-events-none disabled:opacity-60"
      >
        <IconDownloadFile className="text-primary size-14" />
        <span>{loading ? 'Exporting' : 'Export'}</span>
      </button>
      {!!size && size > limit && (
        <dialog className="modal" ref={ref} onClick={close}>
          <form method="dialog" className="text-14 grid gap-16">
            <p>
              This request exceeds the maximum export limit of 10,000.&nbsp;
              <b>Only the last 10,000 records</b> in the selected range will be
              exported.
            </p>
            <p>
              Consider adjusting the filters to only include specific dates or
              trade activity.
            </p>
            <footer className="flex gap-16">
              <Button variant="success" onClick={download}>
                Proceed
              </Button>
              <Button variant="secondary">Cancel</Button>
            </footer>
          </form>
        </dialog>
      )}
    </>
  );
};
