export const LimitSellPreview = () => {
  return (
    <svg viewBox="0 0 1000 1000">
      <use href="#svg-price-path" />
      <g transform="translate(0, 450)">
        <use href="#svg-sell-line" />
      </g>
      <use href="#svg-axis-lines" />
    </svg>
  );
};
