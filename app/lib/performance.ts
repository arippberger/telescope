// Performance monitoring utilities for tracking web vitals and custom metrics

// Web Vitals types
export interface WebVitalsMetric {
  id: string;
  name: 'CLS' | 'FCP' | 'FID' | 'LCP' | 'TTFB' | 'INP';
  value: number;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  navigationType?: string;
}

// Custom performance metrics
export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, string | number>;
}

// Performance thresholds (Core Web Vitals)
const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  FID: { good: 100, poor: 300 }, // First Input Delay
  CLS: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte
  INP: { good: 200, poor: 500 }, // Interaction to Next Paint
} as const;

// Rate web vitals performance
function rateMetric(name: WebVitalsMetric['name'], value: number): WebVitalsMetric['rating'] {
  const thresholds = PERFORMANCE_THRESHOLDS[name];
  if (!thresholds) return 'good';
  
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

// Log performance metrics (in development, send to analytics in production)
function logMetric(metric: WebVitalsMetric | PerformanceMetric) {
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Performance Metric:', metric);
  } else {
    // In production, you'd send this to your analytics service
    // Example: sendToAnalytics(metric);
  }
}

// Web Vitals reporting function
export function reportWebVitals(metric: WebVitalsMetric) {
  // Add rating to the metric
  const enrichedMetric = {
    ...metric,
    rating: rateMetric(metric.name, metric.value),
  };

  logMetric(enrichedMetric);

  // Store in session storage for debugging
  if (typeof window !== 'undefined') {
    try {
      const existingMetrics = JSON.parse(
        sessionStorage.getItem('webVitals') || '[]'
      );
      existingMetrics.push(enrichedMetric);
      sessionStorage.setItem('webVitals', JSON.stringify(existingMetrics));
    } catch (error) {
      console.warn('Failed to store web vitals:', error);
    }
  }
}

// Custom performance tracking
export class PerformanceTracker {
  private static instance: PerformanceTracker;
  private metrics: PerformanceMetric[] = [];

  private constructor() {}

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }

  // Start timing an operation
  startTimer(name: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      this.recordMetric(name, duration, { type: 'timer' });
    };
  }

  // Record a custom metric
  recordMetric(name: string, value: number, metadata?: Record<string, string | number>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      ...(metadata && { metadata }),
    };

    this.metrics.push(metric);
    logMetric(metric);
  }

  // Get all recorded metrics
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  // Clear all metrics
  clearMetrics(): void {
    this.metrics = [];
  }

  // Track API response times
  trackAPICall<T>(apiCall: () => Promise<T>, endpoint: string): Promise<T> {
    const stopTimer = this.startTimer(`api_${endpoint}`);
    
    return apiCall()
      .then((result) => {
        stopTimer();
        this.recordMetric(`api_${endpoint}_success`, 1, { status: 'success' });
        return result;
      })
      .catch((error) => {
        stopTimer();
        this.recordMetric(`api_${endpoint}_error`, 1, { 
          status: 'error',
          errorType: error.name || 'unknown'
        });
        throw error;
      });
  }

  // Track component render times
  trackRender(componentName: string): () => void {
    return this.startTimer(`render_${componentName}`);
  }

  // Track navigation performance
  trackNavigation(from: string, to: string): void {
    this.recordMetric('navigation', 1, { from, to });
  }
}

// Performance monitoring hooks for React components
export function usePerformanceTracker() {
  const tracker = PerformanceTracker.getInstance();
  
  return {
    startTimer: tracker.startTimer.bind(tracker),
    recordMetric: tracker.recordMetric.bind(tracker),
    trackAPICall: tracker.trackAPICall.bind(tracker),
    trackRender: tracker.trackRender.bind(tracker),
    trackNavigation: tracker.trackNavigation.bind(tracker),
    getMetrics: tracker.getMetrics.bind(tracker),
  };
}

// Memory usage monitoring
export function getMemoryUsage() {
  if (typeof window !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usagePercentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100),
    };
  }
  return null;
}

// Bundle size tracking
export function trackBundleSize() {
  if (typeof window !== 'undefined' && 'getEntriesByType' in performance) {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const jsResources = resources.filter(resource => 
      resource.name.includes('.js') && 
      (resource.name.includes('_next') || resource.name.includes('chunks'))
    );

    const totalSize = jsResources.reduce((total, resource) => {
      return total + (resource.transferSize || 0);
    }, 0);

    PerformanceTracker.getInstance().recordMetric('bundle_size', totalSize, {
      resourceCount: jsResources.length,
      unit: 'bytes'
    });

    return {
      totalSize,
      resourceCount: jsResources.length,
      resources: jsResources.map(r => ({
        name: r.name,
        size: r.transferSize,
        duration: r.duration,
      })),
    };
  }
  return null;
}

// Performance observer for monitoring long tasks
export function startLongTaskObserver() {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) { // Tasks longer than 50ms
            PerformanceTracker.getInstance().recordMetric('long_task', entry.duration, {
              type: 'long_task',
              startTime: entry.startTime,
            });
          }
        });
      });

      observer.observe({ entryTypes: ['longtask'] });
      return observer;
    } catch (error) {
      console.warn('Long task observer not supported:', error);
    }
  }
  return null;
}

// Debug function to get all performance data
export function getPerformanceSnapshot() {
  const tracker = PerformanceTracker.getInstance();
  
  return {
    webVitals: typeof window !== 'undefined' 
      ? JSON.parse(sessionStorage.getItem('webVitals') || '[]')
      : [],
    customMetrics: tracker.getMetrics(),
    memoryUsage: getMemoryUsage(),
    bundleInfo: trackBundleSize(),
    timestamp: new Date().toISOString(),
  };
} 