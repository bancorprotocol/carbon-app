import { DetailedHTMLProps, ImgHTMLAttributes } from 'react';
import { useState, useEffect, useMemo } from 'react';
import genericToken from 'assets/icons/generic_token.svg';
import { cn } from 'utils/helpers';

export const useImager = (
  src: string = genericToken,
  fallbackSrc: string = genericToken
) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const source = useMemo(
    () => (src && !hasError ? src : fallbackSrc),
    [fallbackSrc, hasError, src]
  );

  useEffect(() => {
    setHasLoaded(false);
    setHasError(false);

    const image = new Image();
    image.src = src;

    const handleError = () => {
      setHasError(true);
      setHasLoaded(true);
    };

    const handleLoad = () => {
      setHasLoaded(true);
      setHasError(false);
    };

    image.addEventListener('error', handleError);
    image.addEventListener('load', handleLoad);

    return () => {
      image.removeEventListener('error', handleError);
      image.removeEventListener('load', handleLoad);
    };
  }, [src]);

  return { hasLoaded, hasError, source };
};

type ImgAttributes = DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

interface ImageProps extends ImgAttributes {
  src?: string;
  alt: string;
  lazy?: boolean;
  fallbackSrc?: string;
}

export const Imager = ({
  src,
  alt,
  lazy = true,
  fallbackSrc,
  ...props
}: ImageProps) => {
  const { source } = useImager(src, fallbackSrc);

  return (
    <img
      {...props}
      src={source}
      alt={alt}
      loading={lazy ? 'lazy' : 'eager'}
      decoding={lazy ? 'async' : 'auto'}
    />
  );
};

export const LogoImager = ({ className, ...props }: ImageProps) => {
  return <Imager {...props} className={cn('rounded-full', className)} />;
};
