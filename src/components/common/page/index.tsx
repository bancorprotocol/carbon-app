import { FC, ReactNode } from 'react';
import { cn } from 'utils/helpers';

export const Page: FC<{
  children: ReactNode;
  title?: string;
  widget?: ReactNode;
  hideTitle?: boolean;
  className?: string;
}> = ({ children, title, widget, hideTitle, className }) => {
  return (
    <div
      className={cn(
        'px-content pb-30 xl:px-50 mx-auto flex max-w-[1280px] flex-grow flex-col pt-20',
        className,
      )}
    >
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
