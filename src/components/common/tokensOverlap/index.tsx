import { Token } from 'libs/tokens';
import { LogoImager } from 'components/common/imager/Imager';
import { cn } from 'utils/helpers';

export const TokensOverlap = ({
  tokens,
  maxLogos = 4,
  className,
}: {
  tokens: Token[];
  maxLogos?: number;
  className?: string;
}) => {
  const tokenCount = tokens.length;
  return (
    <div className="isolate flex">
      {tokens.slice(0, maxLogos).map((token, index, list) => (
        <LogoImager
          key={token.symbol + index}
          src={token.logoURI}
          alt="Token Logo"
          title={token.symbol}
          className={cn('border border-black bg-black', className)}
          style={{
            zIndex: list.length - index,
            marginLeft: index > 0 ? '-10px' : '0px',
          }}
        />
      ))}
      {tokenCount > maxLogos && (
        <div
          className="size-30 text-12 flex items-center justify-center rounded-full bg-black"
          style={{
            marginLeft: '-10px',
          }}
        >
          +{tokenCount - maxLogos}
        </div>
      )}
    </div>
  );
};
