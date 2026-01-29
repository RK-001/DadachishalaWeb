import { useState, useEffect, useRef, memo, useMemo } from 'react';

/**
 * Optimized AnimatedCounter Component
 * - Secure input sanitization
 * - Memory leak prevention
 * - Latest React patterns (useMemo, cleanup)
 * - Reduced re-renders
 */
const AnimatedCounter = memo(({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  className = '',
  startOnView = true
}) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const counterRef = useRef(null);
  const animationRef = useRef(null);

  // Secure: Sanitize and parse end value (prevent XSS/injection)
  const numericEnd = useMemo(() => {
    if (typeof end === 'number') return Math.max(0, Math.floor(end));
    if (typeof end === 'string') {
      const parsed = parseInt(end.replace(/\D/g, ''), 10);
      return isNaN(parsed) ? 0 : Math.max(0, parsed);
    }
    return 0;
  }, [end]);

  // Memoize formatted number
  const formattedCount = useMemo(() => count.toLocaleString(), [count]);

  useEffect(() => {
    // Early start if not waiting for viewport
    if (!startOnView && !hasStarted) {
      setHasStarted(true);
      
      const startTime = performance.now();
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        
        if (elapsed < duration) {
          const progress = elapsed / duration;
          const easeOut = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(numericEnd * easeOut));
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setCount(numericEnd);
          animationRef.current = null;
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    }

    // IntersectionObserver for viewport detection
    if (!counterRef.current || hasStarted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          
          const startTime = performance.now();
          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            
            if (elapsed < duration) {
              const progress = elapsed / duration;
              const easeOut = 1 - Math.pow(1 - progress, 3);
              setCount(Math.floor(numericEnd * easeOut));
              animationRef.current = requestAnimationFrame(animate);
            } else {
              setCount(numericEnd);
              animationRef.current = null;
            }
          };
          
          animationRef.current = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(counterRef.current);

    return () => {
      observer.disconnect();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [startOnView, hasStarted, numericEnd, duration]);

  return (
    <span ref={counterRef} className={className} aria-live="polite">
      {prefix}{formattedCount}{suffix}
    </span>
  );
});

AnimatedCounter.displayName = 'AnimatedCounter';

export default AnimatedCounter;
