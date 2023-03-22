import { FC, ReactNode } from 'react';

export const Page: FC<{
  children: ReactNode;
  title?: string;
  widget?: JSX.Element;
}> = ({ children, title, widget }) => {
  return (
    <div
      className={
        'px-content mx-auto h-[80%] max-w-[1280px] pt-50 pb-30 xl:px-50'
      }
    >
      <div className="mb-30 flex flex-col justify-between space-y-10 md:flex-row md:items-center md:space-y-0">
        {title && <h1>{title}</h1>}
        {widget && widget}
      </div>
      {children}
    </div>
  );
};
