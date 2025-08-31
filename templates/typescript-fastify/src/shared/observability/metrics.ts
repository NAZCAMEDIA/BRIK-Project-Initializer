/**
 * BRIK v5 Metrics Collection
 */

export interface MetricTags {
  endpoint?: string;
  method?: string;
  status?: string;
  gate?: string;
  port?: string;
  [key: string]: string | undefined;
}

export interface BrikMetrics {
  counter(name: string, value?: number, tags?: MetricTags): void;
  histogram(name: string, value: number, tags?: MetricTags): void;
  gauge(name: string, value: number, tags?: MetricTags): void;
  timing(name: string, value: number, tags?: MetricTags): void;
}

class InMemoryMetrics implements BrikMetrics {
  private metrics: Map<string, any[]> = new Map();

  counter(name: string, value: number = 1, tags?: MetricTags): void {
    const key = this.buildKey(name, tags);
    const existing = this.metrics.get(key) || [];
    existing.push({ type: 'counter', value, timestamp: Date.now() });
    this.metrics.set(key, existing);
  }

  histogram(name: string, value: number, tags?: MetricTags): void {
    const key = this.buildKey(name, tags);
    const existing = this.metrics.get(key) || [];
    existing.push({ type: 'histogram', value, timestamp: Date.now() });
    this.metrics.set(key, existing);
  }

  gauge(name: string, value: number, tags?: MetricTags): void {
    const key = this.buildKey(name, tags);
    this.metrics.set(key, [{ type: 'gauge', value, timestamp: Date.now() }]);
  }

  timing(name: string, value: number, tags?: MetricTags): void {
    const key = this.buildKey(name, tags);
    const existing = this.metrics.get(key) || [];
    existing.push({ type: 'timing', value, timestamp: Date.now() });
    this.metrics.set(key, existing);
  }

  private buildKey(name: string, tags?: MetricTags): string {
    if (!tags) return name;
    const tagString = Object.entries(tags)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key}:${value}`)
      .join(',');
    return `${name}|${tagString}`;
  }

  getMetrics(): Map<string, any[]> {
    return new Map(this.metrics);
  }

  reset(): void {
    this.metrics.clear();
  }
}

export class MetricsFactory {
  private static instance: BrikMetrics;

  static getInstance(): BrikMetrics {
    if (!this.instance) {
      // In production, this would be replaced with a proper metrics backend
      // like Prometheus, DataDog, or similar
      this.instance = new InMemoryMetrics();
    }
    return this.instance;
  }
}

export const metrics = MetricsFactory.getInstance();