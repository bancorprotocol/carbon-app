import { FC, ReactNode } from 'react';

export const Page: FC<{
  children: ReactNode;
  title?: string;
  widget?: JSX.Element;
}> = ({ children, title, widget }) => {
  return (
    <div
      className={'mx-auto mt-50 max-w-[1280px] px-10 pb-30 md:px-20 xl:px-50'}
    >
      <div className="mb-30 flex items-center justify-between">
        {title && <h1>{title}</h1>}
        {widget && widget}
      </div>
      {children}
    </div>
  );
};
