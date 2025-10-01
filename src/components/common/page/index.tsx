import { FC, ReactNode } from 'react';
import { cn } from 'utils/helpers';

export const Page: FC<{
  children: ReactNode;
  title?: string;
  className?: string;
}> = ({ children, title, className }) => {
  return (
    <div
      className={cn(
        'px-content p-16 xl:px-50 mx-auto flex max-w-[1920px] grow flex-col',
        className,
      )}
    >
      {title && (
        <div className="mb-30 flex flex-col justify-between gap-8 md:flex-row md:items-center md:space-y-0">
          {title && <h1>{title}</h1>}
        </div>
      )}
      {children}
    </div>
  );
};
