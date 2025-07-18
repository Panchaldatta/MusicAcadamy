
import { useCallback } from 'react';

export const useLenis = () => {
  const scrollTo = useCallback((target: string | number, options?: any) => {
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.scrollTo(target, options);
    }
  }, []);

  const scrollToTop = useCallback((options?: any) => {
    scrollTo(0, options);
  }, [scrollTo]);

  const scrollToElement = useCallback((selector: string, options?: any) => {
    const element = document.querySelector(selector);
    if (element) {
      // Use the element's offsetTop to get its position
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
      scrollTo(elementTop, options);
    }
  }, [scrollTo]);

  return {
    scrollTo,
    scrollToTop,
    scrollToElement,
  };
};
