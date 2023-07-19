import BigNumber from 'bignumber.js';
import { useGetRoi } from 'libs/queries/extApi/roi';
import { useMemo } from 'react';

export const useRoi = (strategyId: string) => {
  const roiQuery = useGetRoi();

  const strategyRoi = useMemo(() => {
    const rows = roiQuery.data || [];
    const row = rows.find((roiRow) => roiRow.id === strategyId);
    if (!!row) return new BigNumber(row.ROI);
    return undefined;
  }, [roiQuery.data, strategyId]);

  return {
    strategyRoi,
    useGetRoi,
  };
};
