import { area } from 'd3';
import { Accessor } from 'libs/d3/types';
import { SVGProps } from 'react';

interface D3AreaPathProps<T> extends SVGProps<SVGPathElement> {
  xAcc: Accessor<T>;
  y0Acc: Accessor<T>;
  y1Acc: Accessor<T>;
  data: T[];
}

export const D3AreaPath = <T,>({
  xAcc,
  y0Acc,
  y1Acc,
  data,
  ...props
}: D3AreaPathProps<T>) => {
  const dGenerator = area<T>().x(xAcc).y0(y0Acc).y1(y1Acc);
  const d = dGenerator(data) ?? undefined;

  return <path {...props} d={d} />;
};
