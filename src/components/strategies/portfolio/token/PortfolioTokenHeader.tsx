import { Link, Pathnames, PathParams } from 'libs/routing';
import { LogoImager } from 'components/common/imager/Imager';
import { FC } from 'react';
import { cn } from 'utils/helpers';
import { ReactComponent as IconBack } from 'assets/icons/chevron-left.svg';

interface Props {
  backLinkHref: Pathnames;
  backLinkHrefParams?: PathParams;
  logoURI?: string;
  symbol?: string;
}
export const PortfolioTokenHeader: FC<Props> = ({
  backLinkHref,
  backLinkHrefParams,
  logoURI,
  symbol,
}) => {
  return (
    <div
      className={cn(
        'flex',
        'items-center',
        'w-full',
        'bg-emphasis',
        'rounded-10',
        'h-64 lg:h-95',
        'px-20',
        'md:mb-20',
        'lg:-mb-15',
        'lg:pb-15'
      )}
    >
      <Link
        to={backLinkHref}
        params={backLinkHrefParams ?? {}}
        search={{}}
        className={cn(
          'flex',
          'justify-center',
          'items-center',
          'bg-silver',
          'rounded-full',
          'h-32 w-32'
        )}
      >
        <IconBack className={'h-10'} />
      </Link>
      <LogoImager
        alt={'Token Logo'}
        src={logoURI}
        className={'mx-16 h-32 w-32'}
      />
      <span>{symbol ?? 'N/A'}</span>
    </div>
  );
};
