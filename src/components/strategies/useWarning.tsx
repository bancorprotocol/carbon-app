import { useEffect, useState } from 'react';
import { useMarketIndication } from './marketPriceIndication';
import { Token } from 'libs/tokens';
import { OrderCreate } from './create/useOrder';
import { hasWarning } from './utils';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { geoMean } from 'utils/fullOutcome';

interface StrategyWarningParams {
  base?: Token;
  quote?: Token;
  order0: OrderCreate;
  order1: OrderCreate;
  isOverlapping: boolean;
  invalidForm: boolean;
  isConnected?: boolean;
}

export const useStrategyWarning = ({
  base,
  quote,
  order0,
  order1,
  isOverlapping,
  invalidForm,
  isConnected = true,
}: StrategyWarningParams) => {
  const [approvedWarnings, setApprovedWarnings] = useState(false);
  const { isOrderAboveOrBelowMarketPrice: buyOutsideMarket } =
    useMarketIndication({
      base,
      quote,
      order: order0,
      buy: true,
    });
  const { isOrderAboveOrBelowMarketPrice: sellOutsideMarket } =
    useMarketIndication({
      base,
      quote,
      order: order1,
      buy: false,
    });
  const externalMarketPrice = useMarketPrice({ base, quote });
  const oldMarketPrice = geoMean(order0.marginalPrice, order1.marginalPrice);
  const formHasWarning =
    isConnected &&
    hasWarning({
      order0,
      order1,
      buyOutsideMarket,
      sellOutsideMarket,
      isOverlapping,
      oldMarketPrice,
      externalMarketPrice,
    });
  useEffect(() => {
    if (formHasWarning) setApprovedWarnings(false);
  }, [formHasWarning, invalidForm, setApprovedWarnings]);

  const shouldApproveWarnings = formHasWarning && !approvedWarnings;

  return {
    formHasWarning,
    shouldApproveWarnings,
    approvedWarnings,
    setApprovedWarnings,
  };
};
