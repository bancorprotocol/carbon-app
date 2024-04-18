import { FC } from 'react';
import { WarningMessageWithIcon } from 'components/common/WarningMessageWithIcon';

interface Props {
  hasArbOpportunity: boolean;
  isOutOfMarket: boolean;
}

const getDepositOverlappingWarnings = (
  isOutOfMarket: boolean,
  hasArbOpportunity: boolean
) => {
  let warnings: string[] = [];

  if (isOutOfMarket)
    warnings.push(
      'Notice: your strategy is “out of the money” and will be traded when the market price moves into your price range.'
    );
  if (hasArbOpportunity)
    warnings.push(
      'Please note that the deposit budget might create an arb opportunity.'
    );

  return warnings;
};

export const DepositOverlappingWarning: FC<Props> = (props) => {
  const { isOutOfMarket, hasArbOpportunity } = props;

  const warnings = getDepositOverlappingWarnings(
    isOutOfMarket,
    hasArbOpportunity
  );
  if (!warnings.length) return <></>;

  return warnings.map((warning, i) => (
    <WarningMessageWithIcon key={i} message={warning} />
  ));
};
