import { useState } from 'react';
import IconMigrate from 'assets/icons/migrate.svg?react';
import IconClose from 'assets/icons/X.svg?react';
import { lsService } from 'services/localeStorage';

export const MigrationExplainer = () => {
  const [haveSeen, setHaveSeen] = useState(
    lsService.getItem('haveSeen')?.includes('migration'),
  );

  if (haveSeen) return;

  const close = () => {
    const current = lsService.getItem('haveSeen') || [];
    lsService.setItem('haveSeen', current.concat(['migration']));
    setHaveSeen(true);
  };
  return (
    <form
      onSubmit={close}
      className="grid gap-16 border-primary border rounded-2xl bg-primary/10 p-16"
    >
      <header className="flex gap-16 items-start">
        <div className="row-span-2 hidden self-center bg-primary/20 size-32 md:size-48 md:grid place-items-center rounded-full flex-shrink-0">
          <IconMigrate className="size-16 md:size-24" />
        </div>
        <hgroup className="grid flex-grow gap-8">
          <h2 className="text-16 md:text-18 self-center">
            Upgrade your LP positions to Carbon DeFi
          </h2>
          <p className="text-14">
            Move beyond shared pools with fixed parameters and turn passive
            positions into active, customizable strategies.
          </p>
        </hgroup>
        <button
          type="submit"
          aria-label="accept disclaimer"
          className="p-8 rounded-full justify-self-end"
          data-testid="clear-sim-disclaimer"
        >
          <IconClose className="size-14 md:size-18" />
        </button>
      </header>
      <p className="text-14">
        Import positions from supported DEXs, define your own price ranges,
        spreads, and liquidity distribution, and adjust your strategy as markets
        evolve — without the need to withdraw and redeploy.
        <br />
        Your liquidity, on your terms.
      </p>
    </form>
  );
};
