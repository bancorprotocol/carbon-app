import { Route } from '@tanstack/react-router';
import { rootRoot } from 'libs/routing/routes/root';
import { PrivacyPage } from 'pages/privacy';
import { TermsPage } from 'pages/terms';

export const termPage = new Route({
  getParentRoute: () => rootRoot,
  path: '/terms',
  component: TermsPage,
});

export const privacyPage = new Route({
  getParentRoute: () => rootRoot,
  path: '/privacy',
  component: PrivacyPage,
});
