import { useState, useEffect } from 'react';

/**
 * Custom hook to track active section based on scroll position using IntersectionObserver.
 */
export function useScrollSpy(sectionIds: string[], offset = 0.4): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] || '');

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: `-${offset * 100}% 0px -${(1 - offset) * 100}% 0px`,
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds, offset]);

  return activeId;
}
