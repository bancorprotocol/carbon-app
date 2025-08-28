export const FullRange = () => {
  return (
    <svg viewBox="0 0 1000 1000">
      <use href="#svg-price-path" />
      <g className="rect-ranges">
        {/* Marginal */}
        <rect
          x="50"
          y="250"
          width="900"
          height="650"
          fill="url(#svg-sell-gradient)"
          fillOpacity="0.1"
        />
        <rect
          x="50"
          y="250"
          width="900"
          height="650"
          fill="url(#svg-buy-gradient)"
          fillOpacity="0.1"
        />
        <rect
          x="50"
          y="250"
          width="900"
          height="650"
          fill="url(#circle-pattern)"
        />
      </g>

      <line x1="50" x2="950" y1="250" y2="250" stroke="white" strokeWidth="2" />
      <line x1="50" x2="950" y1="900" y2="900" stroke="white" strokeWidth="2" />
      <use href="#svg-axis-lines" />
    </svg>
  );
};
