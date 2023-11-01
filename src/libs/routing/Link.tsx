import { Link as TanstackLink } from '@tanstack/react-router';
import { FC } from 'react';

type GetProps<T> = T extends FC<infer I> ? I : never;
type LinkProps = GetProps<typeof TanstackLink<any>>;

export const Link: FC<LinkProps> = ({ to, children, ...props }) => {
  if (typeof to === 'string' && to.startsWith('http')) {
    if (typeof children === 'function') {
      return (
        <a target="_blank" rel="noreferrer" href={to} {...props}>
          {children({ isActive: false })}
        </a>
      );
    }
    return (
      <a target="_blank" rel="noreferrer" href={to} {...props}>
        {children}
      </a>
    );
  }

  return (
    <TanstackLink to={to} {...props}>
      {children}
    </TanstackLink>
  );
};
