import { SVGProps } from 'react';

export const RecurringRangeRangePreview = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 1000 1000" {...props}>
      <rect
        x="50"
        y="250"
        width="900"
        height="200"
        fill="url(#svg-sell-gradient)"
        fillOpacity="0.6"
      />
      <rect
        x="50"
        y="650"
        width="900"
        height="200"
        fill="url(#svg-buy-gradient)"
        fillOpacity="0.6"
      />
      <use href="#svg-price-path" />
      <use href="#svg-axis-lines" />
      <g transform="translate(0, 250)">
        <use href="#svg-sell-line" />
      </g>
      <g transform="translate(0, 450)">
        <use href="#svg-sell-line" />
      </g>

      <g transform="translate(0, 650)">
        <use href="#svg-buy-line" />
      </g>
      <g transform="translate(0, 850)">
        <use href="#svg-buy-line" />
      </g>
    </svg>
  );
};
