import { FC, ReactNode } from 'react';

export const Page: FC<{ children: ReactNode; title?: string }> = ({
  children,
  title,
}) => {
  return (
    <>
      <h1>{title}</h1>
      {children}
    </>
  );
};
