import { LegacyRef, forwardRef } from 'react';
import { Imager } from 'components/common/imager/Imager';

type TokenPriceProp = {
  price: string;
  iconSrc?: string;
  className?: string;
};

export const TokenPrice = forwardRef<HTMLDivElement, TokenPriceProp>(
  (
    { price, iconSrc, className }: TokenPriceProp,
    ref: LegacyRef<HTMLDivElement> | undefined
  ) => {
    return (
      <div ref={ref} className={`flex items-center gap-7 ${className}`}>
        {price}
        {iconSrc && <Imager className="h-16 w-16" src={iconSrc} alt="token" />}
      </div>
    );
  }
);
