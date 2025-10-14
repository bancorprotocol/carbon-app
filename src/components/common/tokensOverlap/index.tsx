import { Token } from 'libs/tokens';
import { LogoImager } from 'components/common/imager/Imager';

export const TokensOverlap = ({
  tokens,
  size,
  maxLogos = 4,
}: {
  tokens: Token[];
  maxLogos?: number;
  className?: string;
  size: number;
}) => {
  const tokenCount = tokens.length;
  return (
    <span className="isolate flex shrink-0 items-center">
      {tokens.slice(0, maxLogos).map((token, index, list) => (
        <LogoImager
          width={size}
          height={size}
          key={token.symbol + index}
          src={token.logoURI}
          alt="Token Logo"
          title={token.symbol}
          className="max-w-none border border-black bg-black"
          style={{
            zIndex: list.length - index,
            marginLeft: index > 0 ? `-${size * 0.3}px` : '0px',
          }}
        />
      ))}
      {tokenCount > maxLogos && (
        <span
          className="size-30 text-12 flex items-center justify-center rounded-full bg-black"
          style={{
            marginLeft: `-${size * 0.3}px`,
          }}
        >
          +{tokenCount - maxLogos}
        </span>
      )}
    </span>
  );
};
