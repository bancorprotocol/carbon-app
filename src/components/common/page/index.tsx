import { FC, ReactNode } from 'react';

export const Page: FC<{
  children: ReactNode;
  title?: string;
  widget?: JSX.Element;
  hideTitle?: boolean;
}> = ({ children, title, widget, hideTitle }) => {
  return (
    <div className="px-content mx-auto flex max-w-[1280px] flex-grow flex-col pb-30 pt-20 xl:px-50">
      {!hideTitle && (
        <div className="mb-30 flex flex-col justify-between space-y-10 md:flex-row md:items-center md:space-y-0">
          {title && <h1>{title}</h1>}
          {widget && widget}
        </div>
      )}
      {children}
    </div>
  );
};
