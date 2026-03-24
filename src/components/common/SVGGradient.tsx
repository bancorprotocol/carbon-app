export const SVGGradient = () => {
  return (
    <svg width="0" height="0">
      <defs>
        <linearGradient id="svg-main-gradient">
          <stop offset="0%" stopColor="var(--main-gradient-from)" />
          <stop offset="100%" stopColor="var(--main-gradient-to)" />
        </linearGradient>
        <linearGradient id="svg-buy-gradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--color-buy)" />
          <stop offset="100%" stopColor="var(--color-buy-dark)" />
        </linearGradient>
        <linearGradient id="svg-sell-gradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--color-sell)" />
          <stop offset="100%" stopColor="var(--color-sell-dark)" />
        </linearGradient>
        <linearGradient id="svg-white-gradient" x1="0" x2="1" y1="0" y2="1">
          <stop
            offset="0%"
            stopColor="oklch(1 var(--chroma) var(--hue) / 0.1)"
          />
          <stop
            offset="100%"
            stopColor="oklch(1 var(--chroma) var(--hue) / 0.15)"
          />
        </linearGradient>
        <linearGradient
          id="svg-overlapping-gradient"
          x1="0"
          x2="0"
          y1="0"
          y2="1"
        >
          <stop offset="0%" stopColor="var(--color-sell)" />
          <stop offset="100%" stopColor="var(--color-buy)" />
        </linearGradient>
        <linearGradient
          id="reward-gradient"
          x1="27.8523"
          y1="14.4891"
          x2="9.54105"
          y2="32.9994"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#B80093" />
          <stop offset="0.123033" stopColor="#CF28AD" />
          <stop offset="0.399979" stopColor="#E35FC7" />
          <stop offset="0.730614" stopColor="#FAC2E5" />
          <stop offset="1" stopColor="#FFFBFD" stopOpacity="0.8" />
        </linearGradient>
      </defs>
    </svg>
  );
};
