import { Link, Pathnames, PathParams } from 'libs/routing';
import { LogoImager } from 'components/common/imager/Imager';
import { FC } from 'react';
import { backStyle } from 'components/common/button/buttonStyles';
import { BackIcon } from 'components/common/button/BackButton';

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
    <div className="flex items-center w-full rounded-lg">
      <Link
        to={backLinkHref}
        params={backLinkHrefParams ?? {}}
        search={(s) => ({ ...s, token: undefined })}
        resetScroll={false}
        className={backStyle}
      >
        <BackIcon />
      </Link>
      {logoURI && (
        <LogoImager alt="Token Logo" src={logoURI} className="mx-16 size-32" />
      )}
      {symbol && <span>{symbol}</span>}
    </div>
  );
};
