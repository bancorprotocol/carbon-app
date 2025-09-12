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
        'px-content p-16 mx-auto flex flex-col max-w-[1280px]',
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
