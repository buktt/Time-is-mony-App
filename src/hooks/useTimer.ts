import { useState, useEffect, useRef } from 'react';

export const useTimer = (startTime: number | null) => {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (startTime) {
      // Update immediately
      setElapsed(Date.now() - startTime);
      
      // Then update every second
      intervalRef.current = window.setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 1000);
    } else {
      setElapsed(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startTime]);

  return elapsed;
};

