'use client';

import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
}

export function usePerformance() {
  const measurePageLoad = useCallback(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      
      console.log('Page Load Time:', loadTime, 'ms');
      return loadTime;
    }
    return 0;
  }, []);

  const measureWebVitals = useCallback(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // First Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcp = entries[entries.length - 1];
        console.log('First Contentful Paint:', fcp.startTime, 'ms');
      }).observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcp = entries[entries.length - 1];
        console.log('Largest Contentful Paint:', lcp.startTime, 'ms');
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Cumulative Layout Shift
      new PerformanceObserver((list) => {
        let cls = 0;
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as any;
          if (!layoutShiftEntry.hadRecentInput) {
            cls += layoutShiftEntry.value;
          }
        }
        console.log('Cumulative Layout Shift:', cls);
      }).observe({ entryTypes: ['layout-shift'] });
    }
  }, []);

  const trackUserInteraction = useCallback((eventName: string, data?: any) => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', eventName, data);
    }
    
    // Removed unnecessary API call that was causing performance issues
    // The analytics endpoint doesn't exist and was causing delays
  }, []);

  useEffect(() => {
    measurePageLoad();
    measureWebVitals();
  }, [measurePageLoad, measureWebVitals]);

  return {
    measurePageLoad,
    measureWebVitals,
    trackUserInteraction
  };
} 