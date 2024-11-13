import { createRoute } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
import { LiquidityMatrixPage } from 'pages/liquidity-matrix';
import {
  InferSearch,
  searchValidator,
  validAddress,
  validInputNumber,
} from '../utils';
import * as v from 'valibot';

const pairForm = {
  quote: validAddress,
  price: v.optional(validInputNumber),
  baseBudget: v.optional(validInputNumber),
  quoteBudget: v.optional(validInputNumber),
};

const entries = {
  concentration: v.optional(validInputNumber),
  spread: v.optional(validInputNumber),
  base: v.optional(validAddress),
  basePrice: v.optional(validAddress),
  pairs: v.optional(v.array(v.object(pairForm))),
};

export type LiquidityMatrixSearch = InferSearch<typeof entries>;
export type PairFormSearch = InferSearch<typeof pairForm>;

export const liquidityMatrixPage = createRoute({
  getParentRoute: () => rootRoute,
  path: '/liquidity-matrix',
  component: LiquidityMatrixPage,
  validateSearch: searchValidator(entries),
});
