import { useQuery } from '@tanstack/react-query';
import { wait } from 'utils/helpers';
import { QueryKey } from 'libs/queries';
import BigNumber from 'bignumber.js';

type Props = {
  sourceToken: string;
  targetToken: string;
  input: string;
  isTradeBySource: boolean;
};

export const useGetTradeData = ({
  isTradeBySource,
  input,
  sourceToken,
  targetToken,
}: Props) => {
  return useQuery(
    QueryKey.tradeData(sourceToken, targetToken, input),
    async () => {
      if (input === '' || input === '0') {
        return '';
      }
      await wait(1000);
      if (isTradeBySource) {
        // const data = sdk.trade(
        //   sourceToken,
        //   targetToken,
        //   BigNumber.from(input),
        //   !isTradeBySource,
        //   () => false
        // );
        return (Number(input) * 2).toString();
      } else {
        return new BigNumber(input).div(2.1).toString();
      }
    }
  );
};
