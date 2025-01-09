import { useImageLazyLoad } from '@/lib/hooks/useImageLazyLoad';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

export function LazyImage({ src, alt, className, ...props }: LazyImageProps) {
  const { imageRef, isLoaded } = useImageLazyLoad();

  return (
    <img
      ref={imageRef}
      data-src={src}
      alt={alt}
      className={cn(
        'transition-opacity duration-300',
        isLoaded ? 'opacity-100' : 'opacity-0',
        className
      )}
      {...props}
    />
  );
}