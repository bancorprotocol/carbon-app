export type RouterRenderParams = {
  component: () => JSX.Element;
  basePath?: string;
  search?: Record<string, string | number | symbol>;
  params?: Record<string, string>;
};
