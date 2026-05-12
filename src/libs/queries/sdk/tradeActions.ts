import { useQuery } from '@tanstack/react-query';
import { MatchActionBNStr } from '@bancor/carbon-sdk';
import { QueryKey } from 'libs/queries';
import { carbonSDK } from 'libs/sdk';
import { ONE_DAY_IN_MS } from 'utils/time';
import { Token } from 'libs/tokens';
import { useCarbonController } from 'hooks/useContract';

type Props = {
  source: Token;
  target: Token;
  actionsWei: MatchActionBNStr[];
  isTradeBySource: boolean;
};

export const useGetTradeActionsQuery = (props: Props) => {
  const { isTradeBySource, source, target, actionsWei } = props;
  const { data: controller } = useCarbonController();
  return useQuery({
    queryKey: QueryKey.tradeActions(
      [source.address, target.address],
      isTradeBySource,
      actionsWei,
    ),
    queryFn: async () => {
      const tradingFeePPM = await controller!.read.pairTradingFeePPM(
        source.address,
        target.address,
      );
      return carbonSDK.getTradeDataFromActions({
        tradeByTargetAmount: !isTradeBySource,
        actionsWei,
        sourceDecimals: source.decimals,
        targetDecimals: target.decimals,
        tradingFeePPM: Number(tradingFeePPM),
      });
    },
    enabled: !!controller,
    staleTime: ONE_DAY_IN_MS,
  });
};
