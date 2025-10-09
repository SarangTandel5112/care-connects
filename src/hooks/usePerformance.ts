import { useEffect, useState } from 'react';

/**
 * Hook for monitoring performance metrics
 */
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
  });

  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      setMetrics(prev => ({
        renderCount: prev.renderCount + 1,
        lastRenderTime: renderTime,
        averageRenderTime: (prev.averageRenderTime + renderTime) / 2,
      }));
    };
  });

  return metrics;
}

/**
 * Hook for measuring API call performance
 */
export function useApiPerformance() {
  const [apiMetrics, setApiMetrics] = useState<Record<string, {
    count: number;
    totalTime: number;
    averageTime: number;
    lastCall: number;
  }>>({});

  const trackApiCall = (endpoint: string, startTime: number) => {
    const endTime = performance.now();
    const duration = endTime - startTime;

    setApiMetrics(prev => {
      const existing = prev[endpoint] || { count: 0, totalTime: 0, averageTime: 0, lastCall: 0 };
      
      return {
        ...prev,
        [endpoint]: {
          count: existing.count + 1,
          totalTime: existing.totalTime + duration,
          averageTime: (existing.totalTime + duration) / (existing.count + 1),
          lastCall: duration,
        },
      };
    });
  };

  return { apiMetrics, trackApiCall };
}

