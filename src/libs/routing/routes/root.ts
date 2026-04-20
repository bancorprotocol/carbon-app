import { createElement } from 'react';
import { createRootRoute } from '@tanstack/react-router';
import { App } from 'App';
import { AppErrorFallback } from 'components/core/error/AppErrorFallback';

export const rootRoute = createRootRoute({
  component: App,
  errorComponent: ({ error, reset }) => {
    return createElement(AppErrorFallback, { error, reset });
  },
});
