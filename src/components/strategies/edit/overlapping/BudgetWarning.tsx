import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { FC } from 'react';

const budgetWarnings = {
  'dust->below': [],
  'dust->within': [],
  'dust->above': [],
  'below->within': [],
  'below->above': [],
  'within->below': [],
  'within->above': [],
  'above->below': [],
  'above->within': [],
};
type PriceMode = 'dust' | 'below' | 'within' | 'above';
export type BudgetState = `${PriceMode}->${PriceMode}`;
type BudgetWarnings = keyof typeof budgetWarnings;

export function hasBudgetWarning(state: BudgetState): state is BudgetWarnings {
  return state in budgetWarnings;
}

interface Props {
  warning: BudgetWarnings;
}

export const BudgetWarning: FC<Props> = ({ warning }) => {
  return (
    <article>
      <header>
        <IconWarning className="h-14 w-14 text-warning-500" />
        <h3>Edit Budgets</h3>
        {/* TODO */}
        <Tooltip element="" />
      </header>
      <p>Due to the strategy edits, the following budget changes are needed:</p>
      <ol>
        {budgetWarnings[warning].map((text, i) => (
          <li key={text}>
            <svg width="14" height="14" viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="7" />
              <text x="7" y="7" textAnchor="middle">
                {i + 1}
              </text>
            </svg>
            {text}
          </li>
        ))}
      </ol>
      <button className={buttonStyles()}>I understand</button>
    </article>
  );
};
