import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface UseA11yOptions {
  enableSkipLink?: boolean;
  enforceAria?: boolean;
  announceRouteChanges?: boolean;
  enableHighContrast?: boolean;
}

export function useA11y({
  enableSkipLink = true,
  enforceAria = true,
  announceRouteChanges = true,
  enableHighContrast = false
}: UseA11yOptions = {}) {
  const router = useRouter();

  const announcePageChange = useCallback((path: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `Navigated to ${path.replace('/', ' ')}`;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }, []);

  useEffect(() => {
    if (enableSkipLink) {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-white focus:text-primary-600';
      skipLink.textContent = 'Skip to main content';
      document.body.insertBefore(skipLink, document.body.firstChild);

      return () => {
        if (skipLink.parentNode) {
          skipLink.parentNode.removeChild(skipLink);
        }
      };
    }
  }, [enableSkipLink]);

  useEffect(() => {
    if (enforceAria) {
      const checkAria = () => {
        document.querySelectorAll('button, a[href], input, select, textarea').forEach(el => {
          if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
            console.warn('Missing ARIA label on element:', el);
          }
        });
      };

      // Check on initial load and DOM changes
      checkAria();
      const observer = new MutationObserver(checkAria);
      observer.observe(document.body, { childList: true, subtree: true });

      return () => observer.disconnect();
    }
  }, [enforceAria]);

  useEffect(() => {
    if (announceRouteChanges) {
      router.events?.on('routeChangeComplete', announcePageChange);
      return () => {
        router.events?.off('routeChangeComplete', announcePageChange);
      };
    }
  }, [announceRouteChanges, router, announcePageChange]);

  useEffect(() => {
    if (enableHighContrast) {
      document.documentElement.classList.add('high-contrast');
      return () => {
        document.documentElement.classList.remove('high-contrast');
      };
    }
  }, [enableHighContrast]);

  return {
    announceMessage: (message: string) => {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = message;
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 1000);
    }
  };
}