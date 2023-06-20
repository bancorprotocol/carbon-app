import { FC } from 'react';
import { ReactComponent as IconArrowCut } from 'assets/icons/arrow-cut.svg';
import { ReactComponent as IconArrowFull } from 'assets/icons/arrow.svg';
import { useTranslation } from 'libs/translations';

export type ForwardArrowProps = {
  arrowType?: 'full' | 'cut';
  className?: string;
};

export const ForwardArrow: FC<ForwardArrowProps> = ({
  arrowType = 'cut',
  className = '',
}) => {
  const { i18n } = useTranslation();
  const newClassName = `h-12 w-7 ${
    i18n.dir() === 'rtl' ? 'rotate-180' : ''
  } ${className}`;

  return arrowType === 'cut' ? (
    <IconArrowCut className={newClassName} />
  ) : (
    <IconArrowFull className={newClassName} />
  );
};
