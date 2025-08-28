export const OverlappingPreview = () => {
  return (
    <svg viewBox="0 0 1000 1000">
      <use href="#svg-price-path" />
      <g className="rect-ranges">
        {/* Marginal */}
        <rect
          x="50"
          y="350"
          width="900"
          height="300"
          fill="url(#svg-sell-gradient)"
          fillOpacity="0.1"
        />
        <rect
          x="50"
          y="350"
          width="900"
          height="300"
          fill="url(#svg-buy-gradient)"
          fillOpacity="0.1"
        />
        <rect
          x="50"
          y="350"
          width="900"
          height="300"
          fill="url(#circle-pattern)"
        />

        {/* Sell */}
        <rect
          x="50"
          y="250"
          height="100"
          width="900"
          fill="url(#svg-sell-gradient)"
          fillOpacity="0.4"
        />
        {/* Buy */}
        <rect
          x="50"
          y="650"
          height="100"
          width="900"
          fill="url(#svg-buy-gradient)"
          fillOpacity="0.4"
        />
      </g>
      <g className="sell-range">
        <g transform="translate(0, 250)">
          <use href="#svg-sell-line" />
        </g>
        <g transform="translate(0, 650)">
          <use href="#svg-sell-line" />
        </g>
      </g>

      <g className="buy-range">
        <g transform="translate(0, 350)">
          <use href="#svg-buy-line" />
        </g>
        <g transform="translate(0, 750)">
          <use href="#svg-buy-line" />
        </g>
      </g>
      <use href="#svg-axis-lines" />
    </svg>
  );
};
