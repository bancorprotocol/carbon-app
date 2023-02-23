import { FC } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Imager } from 'components/common/imager/Imager';
import { Token } from 'libs/tokens';
import { sanitizeNumberInput } from 'utils/helpers';

export const ModalEditStrategyAllocatedBudget: FC<{
  base?: Token;
  quote?: Token;
  balance?: string;
  buy?: boolean;
}> = ({ base, quote, balance, buy }) => {
  return (
    <div className="flex w-full justify-between rounded-8 border border-emphasis p-15 font-mono text-12 font-weight-500">
      <div className="flex items-center">
        <div className="mr-5">Allocated Budget</div>
        <Tooltip
          iconClassName="h-13 text-white/60"
          element={
            buy
              ? `This is the available amount of ${quote?.symbol} tokens that you are willing to use in order to buy ${base?.symbol}.`
              : `This is the available amount of ${base?.symbol} tokens that you are willing to sell.`
          }
        />
      </div>
      <div className="flex">
        {balance && (
          <span>
            {sanitizeNumberInput(
              balance,
              buy ? base?.decimals : quote?.decimals
            )}
          </span>
        )}
        <Imager
          className="ml-8 h-16 w-16"
          src={buy ? base?.logoURI : quote?.logoURI}
          alt="token"
        />
      </div>
    </div>
  );
};
