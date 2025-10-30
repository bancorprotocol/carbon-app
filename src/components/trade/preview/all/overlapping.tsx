import { SVGProps } from 'react';

export const OverlappingPreview = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 1000 1000" {...props}>
      <rect
        x="50"
        y="450"
        width="900"
        height="200"
        fill="url(#svg-overlapping-gradient)"
        fillOpacity="0.3"
      />
      <use href="#svg-price-path" />
      <g transform="translate(0, 450)">
        <use href="#svg-sell-line" />
      </g>
      <g transform="translate(0, 650)">
        <use href="#svg-buy-line" />
      </g>
      <use href="#svg-axis-lines" />
    </svg>
  );
};
