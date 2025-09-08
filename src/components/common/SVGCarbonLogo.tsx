export const SVGCarbonLogo = () => {
  return (
    <svg width="0" height="0">
      <defs>
        <symbol
          id="carbonLogo"
          width="8"
          height="8"
          viewBox="0 0 672 886"
          fill="dark"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M236.253 0.40625H543.432L590.851 151.443L516.258 259.817L671.892 562.311L597.058 641.054L667.572 865.583H3.43463L31.0508 642.298L0.482422 563.705L34.4791 195.043H66.9848L73.1824 56.3078L236.253 0.40625ZM86.5195 195.043H130.749L109.676 572.069H24.6749L51.0225 639.81L25.5123 846.068H329.049L339.284 534.202L265.803 380.763L236.207 259.029H361.697L442.063 641.054H597.058L671.892 562.311H526.547L404.627 204.8H488.529L516.258 259.817L590.851 151.443H273.103L240.312 19.9215L92.085 70.458L86.5195 195.043Z"
            opacity="0.4"
          />
        </symbol>
        <pattern
          id="base-pattern"
          width="15"
          height="25"
          patternUnits="userSpaceOnUse"
        />
        <pattern href="#base-pattern" id="buy-pattern">
          <use href="#carbonLogo" x="0" y="4" fill="var(--color-buy)" />
          <use href="#carbonLogo" x="8" y="16" fill="var(--color-buy)" />
          <rect
            x="0"
            y="0"
            width="15"
            height="25"
            fill="var(--color-buy)"
            fillOpacity="0.05"
          />
        </pattern>
        <pattern href="#base-pattern" id="sell-pattern">
          <use href="#carbonLogo" x="0" y="4" fill="var(--color-sell)" />
          <use href="#carbonLogo" x="8" y="16" fill="var(--color-sell)" />
          <rect
            x="0"
            y="0"
            width="15"
            height="25"
            fill="var(--color-sell)"
            fillOpacity="0.05"
          />
        </pattern>
      </defs>
    </svg>
  );
};
