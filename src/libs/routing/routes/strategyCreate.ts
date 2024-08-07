// import { Route } from '@tanstack/react-router';
// import { rootRoute } from 'libs/routing/routes/root';
// import {
//   validAddress,
//   validLiteral,
//   validNumber,
//   validateSearchParams,
// } from 'libs/routing/utils';
// import { CreateStrategyTokenPage } from 'pages/strategies/create/token';
// import {
//   CreateDisposableStrategyPage,
//   CreateDisposableStrategySearch,
// } from 'pages/strategies/create/disposable';
// import { StrategyOption } from 'components/strategies/create/strategyOptionItems';
// import {
//   CreateRecurringStrategyPage,
//   CreateRecurringStrategySearch,
// } from 'pages/strategies/create/recurring';
// import {
//   CreateOverlappingStrategyPage,
//   CreateOverlappingStrategySearch,
// } from 'pages/strategies/create/overlapping';

export type StrategyType = 'recurring' | 'disposable' | 'overlapping';
export type StrategyDirection = 'buy' | 'sell';
export type StrategySettings = 'limit' | 'range';

// export interface CreateSelectToken {
//   base?: string;
//   quote?: string;
//   strategyOption?: StrategyOption;
// }

// export const createStrategyPage = new Route({
//   getParentRoute: () => rootRoute,
//   path: '/strategies/create',
//   component: CreateStrategyTokenPage,
//   validateSearch: validateSearchParams<CreateSelectToken>({
//     base: validAddress,
//     quote: validAddress,
//     strategyOption: validLiteral([
//       'disposable',
//       'range-order',
//       'recurring',
//       'overlapping',
//     ]),
//   }),
// });

// export const createDisposableStrategyPage = new Route({
//   getParentRoute: () => rootRoute,
//   path: '/strategies/create/disposable',
//   component: CreateDisposableStrategyPage,
//   validateSearch: validateSearchParams<CreateDisposableStrategySearch>({
//     base: validAddress,
//     quote: validAddress,
//     direction: validLiteral(['buy', 'sell']),
//     settings: validLiteral(['limit', 'range']),
//     min: validNumber,
//     max: validNumber,
//     budget: validNumber,
//   }),
// });

// export const createRecurringStrategyPage = new Route({
//   getParentRoute: () => rootRoute,
//   path: '/strategies/create/recurring',
//   component: CreateRecurringStrategyPage,
//   validateSearch: validateSearchParams<CreateRecurringStrategySearch>({
//     base: validAddress,
//     quote: validAddress,
//     buyMin: validNumber,
//     buyMax: validNumber,
//     buyBudget: validNumber,
//     buySettings: validLiteral(['limit', 'range']),
//     sellMin: validNumber,
//     sellMax: validNumber,
//     sellBudget: validNumber,
//     sellSettings: validLiteral(['limit', 'range']),
//   }),
// });

// export const createOverlappingStrategyPage = new Route({
//   getParentRoute: () => rootRoute,
//   path: '/strategies/create/overlapping',
//   component: CreateOverlappingStrategyPage,
//   validateSearch: validateSearchParams<CreateOverlappingStrategySearch>({
//     base: validAddress,
//     quote: validAddress,
//     marketPrice: validNumber,
//     min: validNumber,
//     max: validNumber,
//     spread: validNumber,
//     budget: validNumber,
//     anchor: validLiteral(['buy', 'sell']),
//   }),
// });
