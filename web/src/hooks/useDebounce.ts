import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useState(Date.now());

  useEffect(() => {
    const handler = setTimeout(function() {
      if (Date.now() - lastRan[0] >= limit) {
        setThrottledValue(value);
        lastRan[1](Date.now());
      }
    }, limit - (Date.now() - lastRan[0]));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}
