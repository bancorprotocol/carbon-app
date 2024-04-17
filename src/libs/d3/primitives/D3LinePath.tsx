import { line } from 'd3';
import { Accessor } from 'libs/d3/types';
import { SVGProps } from 'react';

interface D3LinePathProps<T> extends SVGProps<SVGPathElement> {
  xAcc: Accessor<T>;
  yAcc: Accessor<T>;
  data: T[];
}

export const D3LinePath = <T,>({
  xAcc,
  yAcc,
  data,
  ...props
}: D3LinePathProps<T>) => {
  const lineGenerator = line<T>().x(xAcc).y(yAcc);
  const d = lineGenerator(data) ?? undefined;

  return (
    <path fill="none" stroke="currentColor" strokeWidth={1} {...props} d={d} />
  );
};
