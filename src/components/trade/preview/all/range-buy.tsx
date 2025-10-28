import { SVGProps } from 'react';

export const RangeBuyPreview = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 1000 1000" {...props}>
      <use href="#svg-price-path" />
      <g transform="translate(0, 650)">
        <use href="#svg-buy-line" />
      </g>
      <g transform="translate(0, 850)">
        <use href="#svg-buy-line" />
      </g>
      <rect
        x="50"
        y="650"
        width="900"
        height="200"
        fill="url(#svg-buy-gradient)"
        fillOpacity="0.7"
      />

      <use href="#svg-axis-lines" />
    </svg>
  );
};
