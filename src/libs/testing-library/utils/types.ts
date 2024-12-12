import { ReactNode } from 'react';

export type RouterRenderParams = {
  component: () => ReactNode;
  basePath?: string;
  search?: Record<string, string | number | symbol>;
  params?: Record<string, string>;
};
