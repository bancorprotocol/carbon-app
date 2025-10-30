import { SVGProps } from 'react';

export const FullRangePreview = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 1000 1000" {...props}>
      <rect
        x="50"
        y="50"
        width="900"
        height="900"
        fill="url(#svg-overlapping-gradient)"
        fillOpacity="0.3"
      />
      <use href="#svg-axis-lines" />
      <use href="#svg-price-path" />
      <g transform="translate(0, 50)">
        <use href="#svg-sell-line" />
      </g>
      <g transform="translate(0, 950)">
        <use href="#svg-buy-line" />
      </g>
    </svg>
  );
};
