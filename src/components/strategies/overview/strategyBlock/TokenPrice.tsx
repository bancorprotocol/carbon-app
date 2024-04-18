import { FC } from 'react';
import { LogoImager } from 'components/common/imager/Imager';
import { cn } from 'utils/helpers';

interface Props {
  price: string;
  iconSrc?: string;
  className?: string;
  'data-testid'?: string;
}

export const TokenPrice: FC<Props> = ({
  price,
  iconSrc,
  className = '',
  'data-testid': testId,
}) => {
  return (
    <div
      className={cn('flex items-center gap-4', className)}
      data-testid={testId}
    >
      {iconSrc && <LogoImager className="size-16" src={iconSrc} alt="token" />}
      {price}
    </div>
  );
};
