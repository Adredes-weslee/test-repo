import { useState, useEffect } from 'react';

export const useScrollspy = (
  ids: string[],
  options?: IntersectionObserverInit,
): string | null => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const intersectingIds = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            intersectingIds.add(entry.target.id);
          } else {
            intersectingIds.delete(entry.target.id);
          }
        });

        const newActiveId = ids.find(id => intersectingIds.has(id)) || null;
        
        const isAtBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
        const isAtTop = window.scrollY <= 2;
        if (!isAtBottom && !isAtTop) {
          setActiveId(newActiveId);
        }
      },
      options
    );

    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    const handleScroll = () => {
      const isAtBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
      const isAtTop = window.scrollY <= 2;
      if (isAtBottom && ids.length > 0) {
        setActiveId(ids[ids.length - 1]);
      } else if (isAtTop && ids.length > 0) {
        setActiveId(ids[0]);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ids, options]);

  return activeId;
};