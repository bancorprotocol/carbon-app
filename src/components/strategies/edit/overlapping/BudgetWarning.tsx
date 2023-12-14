import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { FC } from 'react';
import { Token } from 'libs/tokens';

const budgetWarnings = {
  'dust->below': [
    (base: string) => `Withdraw the existing Buy ${base} budget.`,
  ],
  'dust->above': [
    (base: string) => `Withdraw the existing Buy ${base} budget.`,
  ],
  'below->within': [
    (base: string) =>
      `Deposit new Sell ${base} budget. This is needed to support the overlapping dynamics of the strategy.`,
    (base: string) =>
      `Redistribute the existing Buy ${base} budget to be concentrated across the updated active range.`,
  ],
  'within->below': [
    (base: string) =>
      `Redistribute the existing Buy ${base} budget to be concentrated across the updated active range.`,
    (base: string) => `Withdraw the existing Sell ${base} budget.`,
  ],
  'within->above': [
    (base: string) =>
      `Redistribute the existing Sell ${base} budget to be concentrated across the updated active range.`,
    (base: string) => `Withdraw the existing Buy ${base} budget.`,
  ],
  'above->within': [
    (base: string) =>
      `Deposit new Buy ${base} budget. This is needed to support the overlapping dynamics of the strategy.`,
    (base: string) =>
      `Redistribute the existing Sell ${base} budget to be concentrated across the updated active range.`,
  ],
};
export type PricePosition = 'dust' | 'below' | 'within' | 'above';
export type BudgetState = `${PricePosition}->${PricePosition}`;
type BudgetWarnings = keyof typeof budgetWarnings;

export function hasBudgetWarning(state: BudgetState): state is BudgetWarnings {
  return state in budgetWarnings;
}
export function splitBudgetState(state: BudgetState) {
  return state.split('->') as [PricePosition, PricePosition];
}

interface Props {
  base: Token;
  state: BudgetWarnings;
  setState: (state: BudgetState) => void;
}

export const BudgetWarning: FC<Props> = ({ base, state, setState }) => {
  const validate = () => {
    const [_, current] = splitBudgetState(state);
    setState(`${current}->${current}`);
  };
  return (
    <article className="flex w-full flex-col gap-16 rounded-10 border border-warning-500 bg-silver p-20">
      <header className="flex items-center gap-8 ">
        <IconWarning className="h-14 w-14 text-warning-500" />
        <h3 className="flex-1 text-18 font-weight-500">Edit Budget</h3>
        <Tooltip element="Indicate the budget you would like to allocate to the strategy. Note that in order to maintain the overlapping behavior, the 2nd budget indication will be calculated using the prices, spread and budget values.">
          <IconTooltip className="h-14 w-14 text-white/60" />
        </Tooltip>
      </header>
      <p className="text-12 font-weight-400 text-white/60">
        Due to the strategy edits, the following budget changes are needed:
      </p>
      <ol className="flex flex-col gap-8">
        {budgetWarnings[state].map((text, i) => (
          <li key={text(base.symbol)} className="flex items-center gap-8">
            <svg width="14" height="14" viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="7" fill="white" fillOpacity="0.1" />
              {/* eslint-disable-next-line prettier/prettier */}
              <text x="7" y="10" textAnchor="middle" fontSize="8" fill="white">
                {i + 1}
              </text>
            </svg>
            <p className="flex-1 text-12 font-weight-400 text-white/60">
              {text(base.symbol)}
            </p>
          </li>
        ))}
      </ol>
      <button className={buttonStyles()} onClick={validate}>
        I understand
      </button>
    </article>
  );
};
