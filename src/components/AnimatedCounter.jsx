import React, { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({ 
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

  // Parse the end value to handle strings like "300+" or "10+"
  const parseEndValue = (value) => {
    if (typeof value === 'string') {
      // Extract number from strings like "300+" or "1000+"
      const match = value.match(/(\d+)/);
      return match ? parseInt(match[1]) : 0;
    }
    return typeof value === 'number' ? value : 0;
  };

  const numericEnd = parseEndValue(end);

  useEffect(() => {
    if (!startOnView && !hasStarted) {
      setHasStarted(true);
      startCounting();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          startCounting();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [hasStarted, startOnView, numericEnd]);

  const startCounting = () => {
    console.log(`Starting counter animation for value: ${numericEnd}`);
    const startTime = Date.now();
    const startValue = 0;

    const updateCount = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * numericEnd);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(numericEnd);
        console.log(`Counter animation completed: ${numericEnd}`);
      }
    };

    requestAnimationFrame(updateCount);
  };

  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <span ref={counterRef} className={className}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
};

export default AnimatedCounter;
