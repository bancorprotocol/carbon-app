import IconChain from 'assets/icons/chain.svg?react';
import IconRefresh from 'assets/icons/refresh.svg?react';
import OpenInNewIcon from 'assets/icons/open_in_new.svg?react';
import { externalLinks, NewTabLink } from 'libs/routing';

export const ErrorSDKStartSync = () => {
  return (
    <section className="grid place-items-center p-16 sm:mt-80">
      <article className="grid gap-32 w-400 max-w-fit text-center">
        <div className="justify-self-center grid place-items-center size-80 border border-error bg-main-900/40 rounded-full">
          <IconChain className="size-40 text-error" />
        </div>
        <hgroup className="grid gap-24">
          <h2 className="text-24">Connection Interrupted</h2>
          <p className="text-main-0/80">
            We're having a hard time fetching the latest data from the
            blockchain. Don't worry, a quick page refresh usually fixes this.
          </p>
        </hgroup>
        <div className="grid gap-16">
          <button
            className="btn-main-gradient py-8 px-16 flex gap-8 items-center justify-center text-16 sm:text-18"
            onClick={() => location.reload()}
          >
            <IconRefresh className="size-16 sm:size-20" />
            Refresh Page
          </button>
          <p className="flex justify-center gap-16 text-14 text-main-0/80">
            <span>Still not working ?</span>
            <NewTabLink
              to={externalLinks.faq}
              className="flex items-center gap-8"
            >
              Contact Support
              <OpenInNewIcon className="size-16" />
            </NewTabLink>
          </p>
        </div>
      </article>
    </section>
  );
};
