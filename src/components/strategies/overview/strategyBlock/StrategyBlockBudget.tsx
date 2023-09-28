import { FC } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { externalLinks } from 'libs/routing/routes';
import { Link } from 'libs/routing';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import { prettifyNumber } from 'utils/helpers';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Strategy } from 'libs/queries';

interface Props {
  strategy: Strategy;
}

export const StrategyBlockBudget: FC<Props> = ({ strategy }) => {
  const baseFiat = useFiatCurrency(strategy.base);
  const quoteFiat = useFiatCurrency(strategy.quote);
  const baseFiatBalance = baseFiat.getFiatValue(strategy.order1.balance);
  const quoteFiatBalance = quoteFiat.getFiatValue(strategy.order0.balance);
  const noFiatValue = !baseFiat.hasFiatValue() && !quoteFiat.hasFiatValue();
  const totalBalance = baseFiatBalance.plus(quoteFiatBalance);
  const budgetFormatted = prettifyNumber(totalBalance, {
    currentCurrency: baseFiat.selectedFiatCurrency,
  });

  return (
    <article className="flex flex-col rounded-8 border-2 border-emphasis p-16">
      <Tooltip element={<TooltipContent />}>
        <h4 className="text-secondary flex items-center gap-4 font-mono">
          Total Budget
          <IconTooltip className="h-10 w-10" />
        </h4>
      </Tooltip>
      {noFiatValue ? (
        <p className="text-18 font-weight-500 text-white/60">...</p>
      ) : (
        <p className="text-18 font-weight-500">{budgetFormatted}</p>
      )}
    </article>
  );
};

const TooltipContent: FC = () => {
  const currency = useFiatCurrency();
  const fiatSymbol = currency.selectedFiatCurrency;
  return (
    <p>
      Sum of the {fiatSymbol} value of the token budgets.&nbsp;
      <Link to={externalLinks.roiLearnMore} className="text-green">
        <span>Learn how ROI is calculated.</span>
        <IconLink className="mb-1 inline-block h-14 w-14 align-middle" />
      </Link>
    </p>
  );
};
