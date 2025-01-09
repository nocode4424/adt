import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface KeyboardNavigationOptions {
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onEnter?: () => void;
  onEscape?: () => void;
  onShortcuts?: boolean;
  enabled?: boolean;
}

export function useKeyboardNavigation({
  onArrowUp,
  onArrowDown,
  onEnter,
  onEscape,
  onShortcuts = true,
  enabled = true
}: KeyboardNavigationOptions) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle global shortcuts
      if (onShortcuts && event.metaKey || event.ctrlKey) {
        switch (event.key) {
          case 'i':
            event.preventDefault();
            router.push('/dashboard/incidents');
            break;
          case 'e':
            event.preventDefault();
            router.push('/dashboard/expenses');
            break;
          case 'h':
            event.preventDefault();
            router.push('/dashboard');
            break;
        }
        return;
      }

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          onArrowUp?.();
          break;
        case 'ArrowDown':
          event.preventDefault();
          onArrowDown?.();
          break;
        case 'Enter':
          event.preventDefault();
          onEnter?.();
          break;
        case 'Escape':
          event.preventDefault();
          onEscape?.();
          break;
        case 'Tab':
          // Let default tab behavior work
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onArrowUp, onArrowDown, onEnter, onEscape, onShortcuts, router]);
}