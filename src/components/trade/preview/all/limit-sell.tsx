import { SVGProps } from 'react';

export const LimitSellPreview = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 1000 1000" {...props}>
      <use href="#svg-price-path" />
      <use href="#svg-axis-lines" />
      <g transform="translate(0, 450)">
        <use href="#svg-sell-line" />
      </g>
    </svg>
  );
};
