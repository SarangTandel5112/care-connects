import { useEffect, useState } from 'react';

/**
 * Device Detection Hook
 * Simple mobile screen detection only
 * Following Single Responsibility Principle
 */
export const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile };
};
