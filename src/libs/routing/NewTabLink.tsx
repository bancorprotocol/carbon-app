import { FC, HTMLProps } from 'react';

type Props = HTMLProps<HTMLAnchorElement> & { to: string };

export const NewTabLink: FC<Props> = ({ to, children, ...props }) => {
  return (
    <a target="_blank" rel="noreferrer" href={to} {...props}>
      {children}
    </a>
  );
};
