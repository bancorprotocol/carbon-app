import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root';
import { LandingPage } from 'pages/landing';

export const landingPage = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});
