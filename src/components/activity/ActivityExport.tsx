import { Activity, ActivityOrder } from 'libs/queries/extApi/activity';
import { activityActionName } from './utils';
import { getLowestBits } from 'utils/helpers';
import { useActivity } from './context';
import { carbonApi } from 'utils/carbonApi';
import { useTokens } from 'hooks/useTokens';
import { toActivities } from './useActivityQuery';
import { useState } from 'react';
import { SafeDecimal } from 'libs/safedecimal';
import { fromUnixUTC } from 'components/simulator/utils';
import styles from './ActivityExport.module.css';
import { useDialog } from 'hooks/useDialog';

const getActivityCSV = (activities: Activity[]) => {
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
    // @todo(gradient)
    // 'Strategy Type',
    // 'Buy _S P_',
    // 'Buy _E P_',
    // 'Buy _S D_',
    // 'Buy _E D_',
    // 'Sell _S P_',
    // 'Sell _E P_',
    // 'Sell _S D_',
    // 'Sell _E D_',
  ].join(',');

  const body = activities.map((activity) => {
    const { strategy, changes, blockNumber, txHash } = activity;
    const { base, quote } = strategy;
    const date = new Date(activity.date).toLocaleDateString();
    const min = (order: ActivityOrder) => {
      if ('min' in order) return order.min;
      return SafeDecimal.min(order._sP_, order._eP_).toString();
    };
    const max = (order: ActivityOrder) => {
      if ('max' in order) return order.max;
      return SafeDecimal.max(order._sP_, order._eP_).toString();
    };
    const gradientPrices = (order: ActivityOrder) => {
      if ('min' in order) return ['', '', '', ''];
      return [
        order._sP_,
        order._eP_,
        fromUnixUTC(order._sD_).toLocaleDateString(),
        fromUnixUTC(order._eD_).toLocaleDateString(),
      ];
    };
    return [
      getLowestBits(strategy.id),
      strategy.id,
      base.symbol,
      quote.symbol,
      activityActionName[activity.action],
      min(strategy.buy),
      max(strategy.buy),
      strategy.buy.budget,
      min(strategy.sell),
      max(strategy.sell),
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
      // @todo(gradient)
      // strategy.type === 'gradient' ? 'Gradient' : 'Static',
      // ...gradientPrices(strategy.buy),
      // ...gradientPrices(strategy.sell),
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
  const { ref, open, lightDismiss } = useDialog();
  const [loading, setLoading] = useState(false);
  const { queryParams, size } = useActivity();
  const { tokensMap } = useTokens();

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
    if (size && size > limit) open();
    else download();
  };

  return (
    <>
      <button
        type="button"
        onClick={shouldDownload}
        disabled={loading}
        className={styles.exportButton}
      >
        <span className={styles.export}>Export Activities</span>
        <span className={styles.exporting}>Exporting</span>
        <svg
          className={styles.loading}
          width="18"
          height="18"
          viewBox="0 0 50 50"
        >
          <path
            fill="currentColor"
            d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
          />
        </svg>
      </button>
      {!!size && size > limit && (
        <dialog className="modal" ref={ref} onClick={lightDismiss}>
          <form method="dialog" className="text-14 grid gap-16">
            <p>
              The export limit is 10,000 rows.&nbsp;
              <b>Only the most recent 10,000 records will be exported.</b>
            </p>
            <p>To include older data, adjust the date range and try again.</p>
            <footer className="flex gap-16">
              <button className="btn-primary-gradient " onClick={download}>
                Proceed
              </button>
              <button className="btn-secondary-gradient ">Cancel</button>
            </footer>
          </form>
        </dialog>
      )}
    </>
  );
};
