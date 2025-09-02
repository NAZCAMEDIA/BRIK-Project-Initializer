/**
 * ThermodynamicManager - Gestión de Entropía y Estados Termodinámicos
 * 
 * Implementa la gestión completa de estados termodinámicos del sistema BRIK v5,
 * calculando entropía en tiempo real y optimizando recursos según principios
 * de termodinámica digital.
 * 
 * @module ThermodynamicManager
 * @version 1.0.0
 * @certification L4
 */

export enum ThermoState {
  ACTIVE = 'ACTIVE',
  DORMANT = 'DORMANT',
  HIBERNATING = 'HIBERNATING'
}

export interface ThermoStateConfig {
  state: ThermoState;
  entropyTarget: number;
  performanceFactor: number;
  description: string;
}

export interface EnergyMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskIO: number;
  networkIO: number;
  processCount: number;
  timestamp: number;
}

export interface ResourceAllocation {
  cpu: number;
  memory: number;
  threads: number;
  priority: 'low' | 'normal' | 'high' | 'critical';
}

export interface EntropyCalculation {
  value: number;
  components: {
    shannon: number;
    resource: number;
    temporal: number;
  };
  timestamp: number;
}

/**
 * Gestor principal de termodinámica digital del sistema BRIK
 */
export class ThermodynamicManager {
  private currentState: ThermoState;
  private entropyHistory: EntropyCalculation[] = [];
  private metricsBuffer: EnergyMetrics[] = [];
  private readonly maxHistorySize = 1000;
  private readonly stateConfigs: Map<ThermoState, ThermoStateConfig>;
  
  // Factores de la ecuación de entropía
  private readonly lambda = 0.3;  // Factor de eficiencia energética
  private readonly mu = 0.2;      // Factor de optimización de recursos

  constructor() {
    this.currentState = ThermoState.ACTIVE;
    this.stateConfigs = this.initializeStateConfigs();
    this.startMonitoring();
  }

  /**
   * Inicializa las configuraciones de estados termodinámicos
   */
  private initializeStateConfigs(): Map<ThermoState, ThermoStateConfig> {
    const configs = new Map<ThermoState, ThermoStateConfig>();
    
    configs.set(ThermoState.ACTIVE, {
      state: ThermoState.ACTIVE,
      entropyTarget: 0.3,
      performanceFactor: 1.0,
      description: 'Estado de máxima capacidad y rendimiento'
    });
    
    configs.set(ThermoState.DORMANT, {
      state: ThermoState.DORMANT,
      entropyTarget: 0.5,
      performanceFactor: 0.6,
      description: 'Estado de equilibrio optimizado'
    });
    
    configs.set(ThermoState.HIBERNATING, {
      state: ThermoState.HIBERNATING,
      entropyTarget: 0.7,
      performanceFactor: 0.1,
      description: 'Estado de conservación crítica'
    });
    
    return configs;
  }

  /**
   * Calcula la entropía del sistema según la ecuación maestra
   * H(S) = -Σ p(s_i) log₂ p(s_i) + λ∇E(t) - μΔR(t)
   */
  public calculateEntropy(): EntropyCalculation {
    const metrics = this.getCurrentMetrics();
    
    // Componente Shannon: -Σ p(s_i) log₂ p(s_i)
    const shannon = this.calculateShannonEntropy(metrics);
    
    // Gradiente de eficiencia temporal: λ∇E(t)
    const efficiencyGradient = this.calculateEfficiencyGradient();
    
    // Delta de recursos: μΔR(t)
    const resourceDelta = this.calculateResourceDelta();
    
    // Entropía total
    const totalEntropy = Math.max(0, Math.min(1, 
      shannon + (this.lambda * efficiencyGradient) - (this.mu * resourceDelta)
    ));
    
    const calculation: EntropyCalculation = {
      value: totalEntropy,
      components: {
        shannon,
        resource: resourceDelta,
        temporal: efficiencyGradient
      },
      timestamp: Date.now()
    };
    
    this.entropyHistory.push(calculation);
    this.pruneHistory();
    
    return calculation;
  }

  /**
   * Calcula la entropía de Shannon basada en distribución de recursos
   */
  private calculateShannonEntropy(metrics: EnergyMetrics): number {
    const total = metrics.cpuUsage + metrics.memoryUsage + 
                 metrics.diskIO + metrics.networkIO;
    
    if (total === 0) return 0;
    
    const probabilities = [
      metrics.cpuUsage / total,
      metrics.memoryUsage / total,
      metrics.diskIO / total,
      metrics.networkIO / total
    ];
    
    return -probabilities.reduce((entropy, p) => {
      if (p > 0) {
        return entropy + p * Math.log2(p);
      }
      return entropy;
    }, 0) / Math.log2(4); // Normalizar a [0,1]
  }

  /**
   * Calcula el gradiente de eficiencia temporal
   */
  private calculateEfficiencyGradient(): number {
    if (this.metricsBuffer.length < 2) return 0;
    
    const recent = this.metricsBuffer.slice(-10);
    const efficiency = recent.map(m => 
      1 - (m.cpuUsage * 0.4 + m.memoryUsage * 0.3 + 
           m.diskIO * 0.2 + m.networkIO * 0.1)
    );
    
    // Calcular gradiente
    let gradient = 0;
    for (let i = 1; i < efficiency.length; i++) {
      gradient += (efficiency[i] - efficiency[i-1]);
    }
    
    return gradient / (efficiency.length - 1);
  }

  /**
   * Calcula el delta de recursos
   */
  private calculateResourceDelta(): number {
    if (this.metricsBuffer.length < 2) return 0;
    
    const current = this.metricsBuffer[this.metricsBuffer.length - 1];
    const previous = this.metricsBuffer[Math.max(0, this.metricsBuffer.length - 10)];
    
    const deltaSum = Math.abs(current.cpuUsage - previous.cpuUsage) +
                    Math.abs(current.memoryUsage - previous.memoryUsage) +
                    Math.abs(current.diskIO - previous.diskIO) +
                    Math.abs(current.networkIO - previous.networkIO);
    
    return deltaSum / 4; // Promedio normalizado
  }

  /**
   * Transiciona el sistema a un nuevo estado termodinámico
   */
  public async transitionState(targetState: ThermoState): Promise<void> {
    if (this.currentState === targetState) return;
    
    console.log(`🌡️ Transición termodinámica: ${this.currentState} → ${targetState}`);
    
    // Validar transición
    if (!this.isValidTransition(this.currentState, targetState)) {
      throw new Error(`Transición inválida: ${this.currentState} → ${targetState}`);
    }
    
    // Preparar recursos para transición
    await this.prepareTransition(targetState);
    
    // Ejecutar transición
    this.currentState = targetState;
    
    // Aplicar nueva configuración
    await this.applyStateConfiguration(targetState);
    
    console.log(`✅ Transición completada: Estado actual = ${targetState}`);
  }

  /**
   * Valida si una transición de estado es permitida
   */
  private isValidTransition(from: ThermoState, to: ThermoState): boolean {
    // Definir transiciones válidas
    const validTransitions: Record<ThermoState, ThermoState[]> = {
      [ThermoState.ACTIVE]: [ThermoState.DORMANT],
      [ThermoState.DORMANT]: [ThermoState.ACTIVE, ThermoState.HIBERNATING],
      [ThermoState.HIBERNATING]: [ThermoState.DORMANT]
    };
    
    return validTransitions[from]?.includes(to) ?? false;
  }

  /**
   * Prepara el sistema para una transición de estado
   */
  private async prepareTransition(targetState: ThermoState): Promise<void> {
    const config = this.stateConfigs.get(targetState);
    if (!config) throw new Error(`Configuración no encontrada para ${targetState}`);
    
    // Ajustar recursos gradualmente
    const steps = 10;
    const currentConfig = this.stateConfigs.get(this.currentState)!;
    
    for (let i = 1; i <= steps; i++) {
      const factor = i / steps;
      const interpolatedFactor = currentConfig.performanceFactor + 
        (config.performanceFactor - currentConfig.performanceFactor) * factor;
      
      await this.adjustPerformanceFactor(interpolatedFactor);
      await this.delay(100); // Transición suave
    }
  }

  /**
   * Aplica la configuración de un estado termodinámico
   */
  private async applyStateConfiguration(state: ThermoState): Promise<void> {
    const config = this.stateConfigs.get(state);
    if (!config) return;
    
    // Ajustar límites de recursos según el estado
    const allocation = this.calculateOptimalAllocation(config);
    await this.applyResourceAllocation(allocation);
  }

  /**
   * Calcula la asignación óptima de recursos para un estado
   */
  private calculateOptimalAllocation(config: ThermoStateConfig): ResourceAllocation {
    return {
      cpu: Math.floor(100 * config.performanceFactor),
      memory: Math.floor(8192 * config.performanceFactor), // MB
      threads: Math.max(1, Math.floor(8 * config.performanceFactor)),
      priority: config.performanceFactor > 0.8 ? 'high' : 
                config.performanceFactor > 0.4 ? 'normal' : 'low'
    };
  }

  /**
   * Optimiza la asignación de recursos basándose en la entropía actual
   */
  public optimizeResources(): ResourceAllocation {
    const entropy = this.calculateEntropy();
    const config = this.stateConfigs.get(this.currentState)!;
    
    // Si la entropía excede el target, necesitamos optimizar
    if (entropy.value > config.entropyTarget) {
      // Reducir recursos no críticos
      return {
        cpu: 70,
        memory: 4096,
        threads: 4,
        priority: 'normal'
      };
    }
    
    // Si la entropía es muy baja, podemos aumentar rendimiento
    if (entropy.value < config.entropyTarget * 0.5) {
      return {
        cpu: 100,
        memory: 8192,
        threads: 8,
        priority: 'high'
      };
    }
    
    // Estado óptimo
    return this.calculateOptimalAllocation(config);
  }

  /**
   * Monitorea el flujo de energía del sistema
   */
  public monitorEnergyFlow(): EnergyMetrics {
    const metrics = this.getCurrentMetrics();
    this.metricsBuffer.push(metrics);
    this.pruneMetricsBuffer();
    
    // Verificar si necesitamos transición automática
    this.checkAutoTransition();
    
    return metrics;
  }

  /**
   * Verifica si se requiere una transición automática de estado
   */
  private async checkAutoTransition(): Promise<void> {
    const entropy = this.calculateEntropy();
    const config = this.stateConfigs.get(this.currentState)!;
    
    // Transición a DORMANT si entropía alta en ACTIVE
    if (this.currentState === ThermoState.ACTIVE && 
        entropy.value > 0.45) {
      await this.transitionState(ThermoState.DORMANT);
    }
    
    // Transición a HIBERNATING si entropía muy alta en DORMANT
    else if (this.currentState === ThermoState.DORMANT && 
             entropy.value > 0.65) {
      await this.transitionState(ThermoState.HIBERNATING);
    }
    
    // Despertar si entropía baja en HIBERNATING
    else if (this.currentState === ThermoState.HIBERNATING && 
             entropy.value < 0.4) {
      await this.transitionState(ThermoState.DORMANT);
    }
    
    // Activar si entropía muy baja en DORMANT
    else if (this.currentState === ThermoState.DORMANT && 
             entropy.value < 0.25) {
      await this.transitionState(ThermoState.ACTIVE);
    }
  }

  /**
   * Obtiene las métricas actuales del sistema
   */
  private getCurrentMetrics(): EnergyMetrics {
    // En producción, estas métricas vendrían del sistema real
    // Por ahora, simulamos valores para demostración
    return {
      cpuUsage: Math.random() * 0.8 + 0.1,
      memoryUsage: Math.random() * 0.7 + 0.2,
      diskIO: Math.random() * 0.5 + 0.1,
      networkIO: Math.random() * 0.6 + 0.1,
      processCount: Math.floor(Math.random() * 50) + 10,
      timestamp: Date.now()
    };
  }

  /**
   * Inicia el monitoreo continuo del sistema
   */
  private startMonitoring(): void {
    setInterval(() => {
      this.monitorEnergyFlow();
    }, 5000); // Monitorear cada 5 segundos
  }

  /**
   * Ajusta el factor de rendimiento del sistema
   */
  private async adjustPerformanceFactor(factor: number): Promise<void> {
    // Implementación específica del sistema
    console.log(`⚙️ Ajustando factor de rendimiento: ${factor.toFixed(2)}`);
  }

  /**
   * Aplica una asignación de recursos al sistema
   */
  private async applyResourceAllocation(allocation: ResourceAllocation): Promise<void> {
    console.log(`📊 Aplicando asignación de recursos:`, allocation);
    // Implementación específica del sistema
  }

  /**
   * Limpia el historial de entropía para mantener límites de memoria
   */
  private pruneHistory(): void {
    if (this.entropyHistory.length > this.maxHistorySize) {
      this.entropyHistory = this.entropyHistory.slice(-this.maxHistorySize);
    }
  }

  /**
   * Limpia el buffer de métricas
   */
  private pruneMetricsBuffer(): void {
    if (this.metricsBuffer.length > 100) {
      this.metricsBuffer = this.metricsBuffer.slice(-100);
    }
  }

  /**
   * Utilidad para delays asíncronos
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Obtiene el estado actual del sistema
   */
  public getCurrentState(): ThermoState {
    return this.currentState;
  }

  /**
   * Obtiene el historial de entropía
   */
  public getEntropyHistory(): EntropyCalculation[] {
    return [...this.entropyHistory];
  }

  /**
   * Obtiene un reporte completo del estado termodinámico
   */
  public getStatusReport() {
    const entropy = this.calculateEntropy();
    const config = this.stateConfigs.get(this.currentState)!;
    const metrics = this.getCurrentMetrics();
    
    return {
      currentState: this.currentState,
      stateConfig: config,
      entropy: entropy,
      metrics: metrics,
      health: entropy.value <= config.entropyTarget ? 'HEALTHY' : 'DEGRADED',
      recommendation: this.getOptimizationRecommendation(entropy.value, config.entropyTarget)
    };
  }

  /**
   * Genera recomendaciones de optimización
   */
  private getOptimizationRecommendation(currentEntropy: number, targetEntropy: number): string {
    const delta = currentEntropy - targetEntropy;
    
    if (delta > 0.2) {
      return 'CRÍTICO: Reducir carga inmediatamente o transicionar a estado de menor consumo';
    } else if (delta > 0.1) {
      return 'ADVERTENCIA: Optimizar procesos no críticos';
    } else if (delta > 0) {
      return 'PRECAUCIÓN: Monitorear tendencias de entropía';
    } else if (delta < -0.1) {
      return 'ÓPTIMO: Recursos disponibles para mayor carga';
    } else {
      return 'EQUILIBRIO: Sistema en estado óptimo';
    }
  }
}

// Singleton para gestión global
let thermodynamicManager: ThermodynamicManager | null = null;

export function getThermodynamicManager(): ThermodynamicManager {
  if (!thermodynamicManager) {
    thermodynamicManager = new ThermodynamicManager();
  }
  return thermodynamicManager;
}

// Exportar tipos para uso externo
export type { ThermoStateConfig, EnergyMetrics, ResourceAllocation, EntropyCalculation };