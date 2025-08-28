export const RecurringRangeLimitPreview = () => {
  return (
    <svg viewBox="0 0 1000 1000">
      <use href="#svg-price-path" />
      <g transform="translate(0, 250)">
        <use href="#svg-sell-line" />
      </g>
      <g transform="translate(0, 450)">
        <use href="#svg-sell-line" />
      </g>
      <rect
        x="50"
        y="250"
        width="900"
        height="200"
        fill="url(#svg-sell-gradient)"
        fillOpacity="0.4"
      />

      <g transform="translate(0, 450)">
        <use href="#svg-sell-line" />
      </g>

      <use href="#svg-axis-lines" />
    </svg>
  );
};
