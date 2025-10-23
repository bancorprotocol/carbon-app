import { SVGProps } from 'react';

export const SwapPreview = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 1000 1000" {...props}>
      <defs>
        <marker
          id="svg-arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </defs>
      <use href="#svg-price-path" />
      <path
        d="M 500 250 Q 250 250 250 500 Q 250 745 500 750 L 500 750"
        stroke="var(--color-sell)"
        strokeWidth="5"
        fill="none"
        strokeDasharray="50"
        markerEnd="url(#svg-arrow)"
      />
      <g transform="scale(1.5)"></g>
    </svg>
  );
};
