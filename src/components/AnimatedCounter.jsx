import { useState, useEffect, useRef, memo } from 'react';

const AnimatedCounter = memo(({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  className = '',
  startOnView = true
}) => {
  const [count, setCount] = useState(0);
  const spanRef = useRef(null);
  const rafRef = useRef(null);

  const numericEnd = typeof end === 'number'
    ? Math.max(0, Math.floor(end))
    : Math.max(0, parseInt(String(end).replace(/\D/g, ''), 10) || 0);

  useEffect(() => {
    // Keep latest values accessible inside the RAF without stale closures
    const target = numericEnd;
    const dur = duration;

    const run = () => {
      const startTime = performance.now();
      const tick = (now) => {
        const elapsed = now - startTime;
        if (elapsed < dur) {
          const easeOut = 1 - Math.pow(1 - elapsed / dur, 3);
          setCount(Math.floor(target * easeOut));
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setCount(target);
          rafRef.current = null;
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    let observer;
    if (!startOnView) {
      run();
    } else {
      observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { observer.disconnect(); run(); } },
        { threshold: 0.1 }
      );
      if (spanRef.current) observer.observe(spanRef.current);
    }

    return () => {
      // Reset count so StrictMode double-invoke restarts cleanly
      setCount(0);
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      if (observer) observer.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numericEnd, duration, startOnView]);

  return (
    <span ref={spanRef} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
});

AnimatedCounter.displayName = 'AnimatedCounter';
export default AnimatedCounter;
