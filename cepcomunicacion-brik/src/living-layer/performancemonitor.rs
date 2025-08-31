// 🤖 BRIK LIVING LAYER: PerformanceMonitor (TypeScript)
// Adaptive monitoring component - Self-evolving system
// Generated from architecture classification

export interface PerformanceMonitorMetrics {
  value: number;
  timestamp: number;
  metadata: {
    component: string;
    version: string;
    environment: string;
  };
}

export interface PerformanceMonitorConfig {
  enabled: boolean;
  interval: number; // milliseconds
  threshold: {
    value: number;
  };
  alerting: {
    enabled: boolean;
    channels: string[];
  };
}

export class PerformanceMonitorMonitor {
  private config: PerformanceMonitorConfig;
  private metrics: PerformanceMonitorMetrics[] = [];
  private timers: NodeJS.Timeout[] = [];
  private listeners: ((metric: PerformanceMonitorMetrics) => void)[] = [];

  constructor(config: Partial<PerformanceMonitorConfig> = {}) {
    this.config = {
      enabled: true,
      interval: 60000, // 1 minute
      threshold: {
        value: 100,
      },
      alerting: {
        enabled: false,
        channels: []
      },
      ...config
    };
  }

  // BRIK Living Layer: Self-monitoring
  start(): void {
    if (!this.config.enabled) {
      console.log(`${this.constructor.name}: Monitoring disabled`);
      return;
    }

    console.log(`${this.constructor.name}: Starting monitoring every ${this.config.interval}ms`);
    
    const timer = setInterval(() => {
      this.collectMetrics();
    }, this.config.interval);

    this.timers.push(timer);
  }

  stop(): void {
    this.timers.forEach(timer => clearInterval(timer));
    this.timers = [];
    console.log(`${this.constructor.name}: Monitoring stopped`);
  }

  // BRIK Living Layer: Adaptive behavior
  private async collectMetrics(): Promise<void> {
    try {
      const metrics: PerformanceMonitorMetrics = {
        value: Math.random() * 100,
        timestamp: Date.now(),
        metadata: {
          component: 'PerformanceMonitor',
          version: '1.0.0',
          environment: process.env.NODE_ENV || 'development'
        }
      };

      // Store metrics
      this.metrics.push(metrics);
      this.pruneOldMetrics();

      // Analyze and adapt
      await this.analyzeMetrics(metrics);

      // Notify listeners
      this.notifyListeners(metrics);

      console.log(`${this.constructor.name}: Collected metrics`, {
        value: metrics.value
      });

    } catch (error) {
      console.error(`${this.constructor.name}: Error collecting metrics`, error);
    }
  }

  // BRIK Living Layer: Intelligent analysis
  private async analyzeMetrics(current: PerformanceMonitorMetrics): Promise<void> {
    // Threshold checking
    
    if (current.value > this.config.threshold.value) {
      await this.handleThresholdExceeded('value', current.value, this.config.threshold.value);
    }

    // Trend analysis (last 10 metrics)
    if (this.metrics.length >= 10) {
      const recent = this.metrics.slice(-10);
      await this.analyzeTrend("value", recent.map(m => m.value));
    }

    // Adaptive configuration adjustment
    await this.adaptConfiguration(current);
  }

  private async handleThresholdExceeded(metric: string, value: number, threshold: number): Promise<void> {
    const alert = {
      component: 'PerformanceMonitor',
      metric,
      value,
      threshold,
      timestamp: Date.now(),
      severity: value > threshold * 2 ? 'high' : 'medium'
    };

    console.warn(`${this.constructor.name}: Threshold exceeded`, alert);

    if (this.config.alerting.enabled) {
      // TODO: Send alerts to configured channels
      // await this.sendAlert(alert);
    }
  }

  private async analyzeTrend(metric: string, values: number[]): Promise<void> {
    const trend = this.calculateTrend(values);
    
    if (Math.abs(trend) > 0.1) { // 10% change
      console.info(`${this.constructor.name}: Trend detected for ${metric}`, {
        trend: trend > 0 ? 'increasing' : 'decreasing',
        magnitude: Math.abs(trend)
      });
    }
  }

  private async adaptConfiguration(metrics: PerformanceMonitorMetrics): Promise<void> {
    // Adaptive behavior based on system state
    const avgLoad = this.getAverageLoad();
    
    if (avgLoad > 0.8) {
      // System under stress - reduce monitoring frequency
      if (this.config.interval < 300000) { // max 5 minutes
        this.config.interval = Math.min(this.config.interval * 1.5, 300000);
        this.restart();
      }
    } else if (avgLoad < 0.3) {
      // System idle - increase monitoring frequency  
      if (this.config.interval > 30000) { // min 30 seconds
        this.config.interval = Math.max(this.config.interval * 0.8, 30000);
        this.restart();
      }
    }
  }

  // Event subscription for reactive behavior
  onMetricCollected(callback: (metric: PerformanceMonitorMetrics) => void): void {
    this.listeners.push(callback);
  }

  private notifyListeners(metrics: PerformanceMonitorMetrics): void {
    this.listeners.forEach(callback => {
      try {
        callback(metrics);
      } catch (error) {
        console.error('Metric listener error:', error);
      }
    });
  }

  // Utility methods
  private pruneOldMetrics(): void {
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    const cutoff = Date.now() - maxAge;
    this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    const first = values[0];
    const last = values[values.length - 1];
    return (last - first) / first;
  }

  private getAverageLoad(): number {
    if (this.metrics.length === 0) return 0;
    const recent = this.metrics.slice(-5);
    const avg = recent.reduce((sum, m) => sum + m.value, 0) / recent.length;
    return avg / 100; // normalize to 0-1
  }

  private restart(): void {
    this.stop();
    setTimeout(() => this.start(), 1000);
  }

  // Public API for external monitoring
  getMetrics(): PerformanceMonitorMetrics[] {
    return [...this.metrics];
  }

  getCurrentMetrics(): PerformanceMonitorMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null;
  }

  getConfig(): PerformanceMonitorConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<PerformanceMonitorConfig>): void {
    this.config = { ...this.config, ...updates };
    
    if (updates.interval) {
      this.restart();
    }
  }
}