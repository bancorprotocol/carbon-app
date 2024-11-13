import { lsService } from 'services/localeStorage';

/**
 * ⚠️ Deprecated flags ⚠️
 * To avoid possible overlap with deprecated flags do not use any of these deprecated flags:
 * <empty for now>
 */

export const featureFlags = [
  {
    value: 'liquidity-matrix' as const,
    label: 'Liquidity Matrix',
    description: 'Create a group of concentrated liquidity strategies',
  },
];

type CurrentFlags = (typeof featureFlags)[number]['value'];

/** Easily know if the user has an active flag */
export const hasFlag = (flag: CurrentFlags) =>
  (lsService.getItem('featureFlags') ?? []).includes(flag);
