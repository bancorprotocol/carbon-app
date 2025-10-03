import { SVGProps } from 'react';

export const RecurringLimitLimitPreview = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 1000 1000" {...props}>
      <use href="#svg-price-path" />
      <g transform="translate(0, 650)">
        <use href="#svg-buy-line" />
      </g>
      <g transform="translate(0, 450)">
        <use href="#svg-sell-line" />
      </g>
      <use href="#svg-axis-lines" />
    </svg>
  );
};
