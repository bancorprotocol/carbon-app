import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
import { CartPage } from 'pages/cart';
import config from 'config';

export const cartPage = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
  loader: () => {
    if (!config.ui.showCart) {
      throw redirect({ to: '/' });
    }
  },
});
