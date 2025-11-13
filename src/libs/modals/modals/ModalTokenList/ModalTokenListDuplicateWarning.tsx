import { NewTabLink } from 'libs/routing';
import { Token } from 'libs/tokens';
import { getExplorerLink } from 'utils/blockExplorer';
import { shortenString } from 'utils/helpers';
import { NATIVE_TOKEN_ADDRESS } from 'utils/tokens';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { FC, useId } from 'react';
import { computePosition, offset } from '@floating-ui/core';
import { platform } from '@floating-ui/dom';

type Props = {
  token: Token;
};

export const ModalTokenListDuplicateWarning: FC<Props> = ({ token }) => {
  const anchorId = useId();
  const popoverId = useId();
  const isNativeToken = token.address === NATIVE_TOKEN_ADDRESS;

  // TODO: Use Tooltip component once it's
  const showTooltip = async () => {
    const anchor = document.getElementById(anchorId);
    const popover = document.getElementById(popoverId);
    if (!popover || !anchor) return;
    popover.showPopover();
    const { x, y } = await computePosition(anchor, popover, {
      platform,
      placement: 'right',
      strategy: 'fixed',
      middleware: [offset(6)],
    });
    popover.style.setProperty('left', `${x}px`);
    popover.style.setProperty('top', `${y}px`);
  };

  const hideTooltip = () => {
    const popover = document.getElementById(popoverId);
    setTimeout(() => {
      if (popover?.matches(':hover')) return;
      document.getElementById(popoverId)?.hidePopover();
    }, 50);
  };

  const duplicatedTokenTooltipElement = (token: Token) => {
    if (isNativeToken) return 'This is the native token of the chain.';

    return (
      <div className="grid gap-8 max-w-450 text-start">
        <p className="text-wrap">
          It appears there might be multiple tokens with the same symbol. Please
          ensure you select the correct address.
        </p>
        <p className="flex items-center">
          {token.symbol}: {token.address}
          <NewTabLink to={getExplorerLink('token', token.address)}>
            <IconLink className="ml-6 w-14 text-white/80" />
          </NewTabLink>
        </p>
      </div>
    );
  };

  return (
    <div className="text-12 flex max-w-full truncate py-2 text-white/60">
      {isNativeToken ? 'Native Gas Token' : shortenString(token.address)}
      <IconWarning
        id={anchorId}
        className="ml-5 size-14 text-white/60"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        id={popoverId}
        onMouseLeave={hideTooltip}
        className="bg-main-600/40 text-14 rounded-2xl px-24 py-16 text-white backdrop-blur-2xl"
        popover="manual"
      >
        {duplicatedTokenTooltipElement(token)}
      </div>
    </div>
  );
};
