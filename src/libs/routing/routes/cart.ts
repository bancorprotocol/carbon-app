import { createRoute } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
import { CartPage } from 'pages/cart';

export const cartPage = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});
