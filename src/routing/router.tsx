import { FC, ReactNode } from 'react';
import {
  Router as LocationRouter,
  ReactLocation,
} from '@tanstack/react-location';
import { routes } from './routes';
import { ReactLocationDevtools } from '@tanstack/react-location-devtools';

const location = new ReactLocation();

export const Router: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <LocationRouter location={location} routes={routes}>
      {children}
      <ReactLocationDevtools position="bottom-right" />
    </LocationRouter>
  );
};
