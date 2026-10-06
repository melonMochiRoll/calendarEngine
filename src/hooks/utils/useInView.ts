import { useEffect, useRef } from "react";

export function useInView(
  onIntersect: () => void,
  {
    enable = false,
    root = null,
    rootMargin = '0px 0px 0px 0px',
  } = {},
) {
  const targetRef = useRef(null);

  useEffect(() => {
    if (!enable || !targetRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onIntersect();
      },
      { root, rootMargin },
    );

    observer.observe(targetRef.current);
    return () => observer.disconnect();
  }, [onIntersect, enable, root, rootMargin]);

  return targetRef;
}