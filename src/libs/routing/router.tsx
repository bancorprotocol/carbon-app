import { FC, ReactNode } from 'react';
import {
  Router as LocationRouter,
  ReactLocation,
} from '@tanstack/react-location';
import { routes } from 'libs/routing/routes';
import { parseSearchWith } from 'libs/routing/utils';

const location = new ReactLocation({
  parseSearch: parseSearchWith((search) => JSON.parse(search)),
});

export const Router: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <LocationRouter location={location} routes={routes}>
      {children}
    </LocationRouter>
  );
};
