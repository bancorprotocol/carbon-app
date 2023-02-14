import { FC } from 'react';
import { Imager } from 'components/common/imager/Imager';

export const TokenPrice: FC<{
  price: string;
  iconSrc?: string;
  className?: string;
}> = ({ price, iconSrc, className = '' }) => {
  return (
    <div className={`flex items-center gap-7 ${className}`}>
      {price}
      {iconSrc && <Imager className="h-16 w-16" src={iconSrc} alt="token" />}
    </div>
  );
};
