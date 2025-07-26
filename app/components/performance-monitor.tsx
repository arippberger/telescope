'use client';

import { useEffect } from 'react';
import { startLongTaskObserver, getPerformanceSnapshot, PerformanceTracker } from '../lib/performance';

export default function PerformanceMonitor() {
  useEffect(() => {
    const tracker = PerformanceTracker.getInstance();

    // Track navigation timing
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        // Track key timing metrics
        tracker.recordMetric('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
        tracker.recordMetric('load_complete', navigation.loadEventEnd - navigation.loadEventStart);
        tracker.recordMetric('dns_lookup', navigation.domainLookupEnd - navigation.domainLookupStart);
        tracker.recordMetric('tcp_connection', navigation.connectEnd - navigation.connectStart);
        
        // Track First Contentful Paint if available
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        if (fcp) {
          tracker.recordMetric('first_contentful_paint', fcp.startTime);
        }

        const lcp = paintEntries.find(entry => entry.name === 'largest-contentful-paint');
        if (lcp) {
          tracker.recordMetric('largest_contentful_paint', lcp.startTime);
        }
      }
    }

    // Start monitoring long tasks
    const longTaskObserver = startLongTaskObserver();

    // Track memory usage periodically (development only)
    let memoryInterval: NodeJS.Timeout | null = null;
    if (process.env.NODE_ENV === 'development') {
      // Add a global function to get performance snapshot
      (window as any).getPerformanceSnapshot = getPerformanceSnapshot;
      
      // Track memory usage every 30 seconds
      memoryInterval = setInterval(() => {
        const memoryUsage = getPerformanceSnapshot().memoryUsage;
        if (memoryUsage) {
          tracker.recordMetric('memory_usage_percentage', memoryUsage.usagePercentage);
        }
      }, 30000);

      // Log initial performance data after a short delay
      const timeoutId = setTimeout(() => {
        console.log('🚀 Initial Performance Snapshot:', getPerformanceSnapshot());
      }, 2000);

      return () => {
        clearTimeout(timeoutId);
        if (memoryInterval) clearInterval(memoryInterval);
        if (longTaskObserver) {
          longTaskObserver.disconnect();
        }
      };
    }

    return () => {
      if (memoryInterval) clearInterval(memoryInterval);
      if (longTaskObserver) {
        longTaskObserver.disconnect();
      }
    };
  }, []);

  // This component doesn't render anything
  return null;
} 