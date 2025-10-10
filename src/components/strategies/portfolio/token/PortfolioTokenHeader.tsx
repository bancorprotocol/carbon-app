import { Link, Pathnames, PathParams } from 'libs/routing';
import { LogoImager } from 'components/common/imager/Imager';
import { FC } from 'react';
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
    <div className="flex items-center w-full rounded-lg lg:h-95 h-64 px-20 md:mb-20 lg:-mb-15 lg:pb-15">
      <Link
        to={backLinkHref}
        params={backLinkHrefParams ?? {}}
        search={(s) => ({ ...s, token: undefined })}
        resetScroll={false}
        className="grid place-items-center btn-secondary-gradient rounded-full size-32"
      >
        <IconBack className="h-10" />
      </Link>
      {logoURI && (
        <LogoImager alt="Token Logo" src={logoURI} className="mx-16 size-32" />
      )}
      {symbol && <span>{symbol}</span>}
    </div>
  );
};
