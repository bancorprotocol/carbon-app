import { Tooltip } from "components/common/tooltip/Tooltip";
import { TokenPrice } from "components/strategies/overview/strategyBlock/TokenPrice";
import { Token } from "libs/tokens";
import { FC } from "react";
import { sanitizeNumberInput } from "utils/helpers";

export interface TooltipPriceProps {
  price?: string;
  buy?: boolean;
  base: Token;
  quote: Token;
  budgetFiat: string;
}

export const TooltipPrice: FC<TooltipPriceProps> = (props) => {
  const { buy, base, quote, budgetFiat } = props;
  if (!props.price) return <></>;
  const price = sanitizeNumberInput(
    props.price,
    buy ? quote.decimals : base.decimals
  );
  return (
    <Tooltip
      element={
        <>
          <TokenPrice
            price={price}
            iconSrc={buy ? quote?.logoURI : base?.logoURI}
          />
          <TokenPrice className="text-white/60" price={budgetFiat} />
        </>
      }
    >
      <b>{price}</b>
    </Tooltip>
  );
};
