import { createRoute } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
import { PrivacyPage } from 'pages/privacy';
import { TermsPage } from 'pages/terms';

export const termPage = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: TermsPage,
});

export const privacyPage = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: PrivacyPage,
});
