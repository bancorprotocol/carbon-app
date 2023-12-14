import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { FC } from 'react';

const budgetWarnings = {
  'below->within': ['below->within'],
  'below->above': ['below->above'],
  'within->below': ['within->below'],
  'within->above': ['within->above'],
  'above->below': ['above->below'],
  'above->within': ['above->within'],
};
export type PricePosition = 'below' | 'within' | 'above';
export type BudgetState = `${PricePosition}->${PricePosition}`;
type BudgetWarnings = keyof typeof budgetWarnings;

export function hasBudgetWarning(state: BudgetState): state is BudgetWarnings {
  return state in budgetWarnings;
}

interface Props {
  warning: BudgetWarnings;
  setState: (state: BudgetState) => void;
}

export const BudgetWarning: FC<Props> = ({ warning, setState }) => {
  const validate = () => {
    const [prev, current] = warning.split('->') as [
      PricePosition,
      PricePosition
    ];
    setState(`${current}->${current}`);
  };
  return (
    <article className="flex w-full flex-col gap-20 rounded-10 border border-warning-500 bg-silver p-20">
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
      <ol>
        {budgetWarnings[warning].map((text, i) => (
          <li key={text} className="flex items-center gap-8">
            <svg width="14" height="14" viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="7" fill="black" fillOpacity="0.1" />
              {/* eslint-disable-next-line prettier/prettier */}
              <text
                x="7"
                y="7"
                textAnchor="middle"
                fontSize="8"
                fill="white"
                dominantBaseline="middle"
              >
                {i + 1}
              </text>
            </svg>
            <p className="text-12 font-weight-400 text-white/60">{text}</p>
          </li>
        ))}
      </ol>
      <button className={buttonStyles()} onClick={validate}>
        I understand
      </button>
    </article>
  );
};
