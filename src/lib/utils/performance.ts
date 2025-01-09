import { useEffect, useRef, useCallback } from 'react';

// Debounce hook
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    }, options);

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => observer.disconnect();
  }, [callback, options]);

  return targetRef;
}

// Progressive loading for large lists
export function useProgressiveLoading<T>(
  items: T[],
  batchSize: number = 20
): T[] {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [currentBatch, setCurrentBatch] = useState(1);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      const nextBatch = items.slice(0, currentBatch * batchSize);
      setVisibleItems(nextBatch);
    });

    return () => cancelAnimationFrame(timer);
  }, [items, currentBatch, batchSize]);

  const loadMore = useCallback(() => {
    setCurrentBatch(prev => prev + 1);
  }, []);

  return {
    visibleItems,
    loadMore,
    hasMore: visibleItems.length < items.length
  };
}