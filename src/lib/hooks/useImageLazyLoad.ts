import { useEffect, useRef, useState } from 'react';

interface UseImageLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useImageLazyLoad(options: UseImageLazyLoadOptions = {}) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && imageRef.current) {
          const img = imageRef.current;
          const src = img.getAttribute('data-src');
          
          if (src) {
            img.src = src;
            img.classList.remove('opacity-0');
            img.classList.add('opacity-100');
            setIsLoaded(true);
            observer.unobserve(img);
          }
        }
      },
      {
        threshold: options.threshold || 0,
        rootMargin: options.rootMargin || '50px'
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [options.threshold, options.rootMargin]);

  return { imageRef, isLoaded };
}