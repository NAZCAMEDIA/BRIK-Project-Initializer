/**
 * Living Code Layer - Sistema de Consciencia Computacional
 * 
 * Implementa la capa de código viviente que proporciona consciencia,
 * razonamiento y capacidad de decisión autónoma al sistema BRIK v5.
 * 
 * @module LivingCodeLayer
 * @version 1.0.0
 * @certification L4
 */

import { ThermodynamicManager, ThermoState } from './ThermodynamicManager';

export interface SystemEnvironment {
  timestamp: number;
  systemLoad: number;
  activeComponents: string[];
  pendingTasks: Task[];
  systemHealth: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  externalEvents: Event[];
}

export interface Perception {
  environment: SystemEnvironment;
  patterns: Pattern[];
  anomalies: Anomaly[];
  opportunities: Opportunity[];
  threats: Threat[];
}

export interface Pattern {
  type: string;
  confidence: number;
  description: string;
  frequency: number;
}

export interface Anomaly {
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  component: string;
  description: string;
  detectedAt: number;
}

export interface Opportunity {
  type: 'OPTIMIZATION' | 'SCALING' | 'FEATURE' | 'INTEGRATION';
  impact: number;
  effort: number;
  description: string;
}

export interface Threat {
  type: 'SECURITY' | 'PERFORMANCE' | 'STABILITY' | 'RESOURCE';
  severity: number;
  probability: number;
  description: string;
}

export interface PerceptionData {
  raw: any;
  processed: Perception;
  confidence: number;
}

export interface Reasoning {
  conclusions: Conclusion[];
  hypotheses: Hypothesis[];
  recommendations: Recommendation[];
  confidence: number;
}

export interface Conclusion {
  statement: string;
  evidence: string[];
  confidence: number;
}

export interface Hypothesis {
  statement: string;
  probability: number;
  testable: boolean;
}

export interface Recommendation {
  action: string;
  priority: number;
  impact: number;
  reasoning: string;
}

export interface DecisionSpace {
  options: DecisionOption[];
  constraints: Constraint[];
  objectives: Objective[];
  timeLimit?: number;
}

export interface DecisionOption {
  id: string;
  action: string;
  benefits: string[];
  risks: string[];
  cost: number;
}

export interface Constraint {
  type: 'RESOURCE' | 'TIME' | 'POLICY' | 'TECHNICAL';
  description: string;
  hard: boolean;
}

export interface Objective {
  description: string;
  weight: number;
  metric: string;
}

export interface Decision {
  selectedOption: DecisionOption;
  reasoning: string;
  confidence: number;
  alternativesConsidered: DecisionOption[];
  timestamp: number;
}

export interface Action {
  id: string;
  type: string;
  target: string;
  parameters: any;
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'FAILED';
  result?: any;
  error?: string;
}

export interface Experience {
  perception: Perception;
  reasoning: Reasoning;
  decision: Decision;
  action: Action;
  outcome: Outcome;
  timestamp: number;
}

export interface Outcome {
  success: boolean;
  impact: number;
  lessons: string[];
  unexpectedEffects: string[];
}

export interface Knowledge {
  patterns: Pattern[];
  rules: Rule[];
  heuristics: Heuristic[];
  cases: Experience[];
}

export interface Rule {
  condition: string;
  action: string;
  confidence: number;
  exceptions: string[];
}

export interface Heuristic {
  situation: string;
  approach: string;
  successRate: number;
  lastUpdated: number;
}

export interface Task {
  id: string;
  description: string;
  priority: number;
  deadline?: number;
}

export interface Event {
  type: string;
  source: string;
  data: any;
  timestamp: number;
}

/**
 * Interfaz de consciencia para componentes del sistema
 */
export interface IConsciousCode {
  perceive(environment: SystemEnvironment): Promise<Perception>;
  reason(data: PerceptionData): Promise<Reasoning>;
  decide(options: DecisionSpace): Promise<Decision>;
  act(decision: Decision): Promise<Action>;
  learn(experience: Experience): Promise<Knowledge>;
}

/**
 * Implementación del Living Code Layer - Sistema Nervioso Digital
 */
export class LivingCodeLayer implements IConsciousCode {
  private consciousness: ConsciousnessCore;
  private knowledgeBase: Knowledge;
  private experienceMemory: Experience[] = [];
  private thermodynamicManager: ThermodynamicManager;
  private readonly maxMemorySize = 10000;
  
  // Umbrales de consciencia
  private readonly awarenessThreshold = 0.7;
  private readonly decisionThreshold = 0.8;
  private readonly learningRate = 0.1;

  constructor(thermodynamicManager: ThermodynamicManager) {
    this.thermodynamicManager = thermodynamicManager;
    this.consciousness = new ConsciousnessCore();
    this.knowledgeBase = this.initializeKnowledge();
    this.startConsciousnessLoop();
  }

  /**
   * Percibe el entorno del sistema y extrae información relevante
   */
  public async perceive(environment: SystemEnvironment): Promise<Perception> {
    console.log('👁️ Percibiendo entorno del sistema...');
    
    // Analizar patrones en el entorno
    const patterns = await this.detectPatterns(environment);
    
    // Detectar anomalías
    const anomalies = await this.detectAnomalies(environment);
    
    // Identificar oportunidades
    const opportunities = await this.identifyOpportunities(environment);
    
    // Evaluar amenazas
    const threats = await this.assessThreats(environment);
    
    const perception: Perception = {
      environment,
      patterns,
      anomalies,
      opportunities,
      threats
    };
    
    // Actualizar estado de consciencia
    this.consciousness.updateAwareness(perception);
    
    return perception;
  }

  /**
   * Razona sobre los datos percibidos y genera conclusiones
   */
  public async reason(data: PerceptionData): Promise<Reasoning> {
    console.log('🧠 Razonando sobre datos percibidos...');
    
    // Generar conclusiones basadas en evidencia
    const conclusions = await this.generateConclusions(data);
    
    // Formular hipótesis
    const hypotheses = await this.formulateHypotheses(data);
    
    // Crear recomendaciones
    const recommendations = await this.createRecommendations(data, conclusions);
    
    // Calcular confianza general
    const confidence = this.calculateReasoningConfidence(conclusions, hypotheses);
    
    return {
      conclusions,
      hypotheses,
      recommendations,
      confidence
    };
  }

  /**
   * Toma decisiones basadas en el espacio de decisión disponible
   */
  public async decide(options: DecisionSpace): Promise<Decision> {
    console.log('⚖️ Tomando decisión estratégica...');
    
    // Evaluar cada opción contra objetivos y restricciones
    const evaluations = await this.evaluateOptions(options);
    
    // Seleccionar la mejor opción
    const selectedOption = this.selectBestOption(evaluations, options);
    
    // Generar razonamiento para la decisión
    const reasoning = this.generateDecisionReasoning(selectedOption, evaluations, options);
    
    // Calcular confianza en la decisión
    const confidence = this.calculateDecisionConfidence(selectedOption, evaluations);
    
    return {
      selectedOption,
      reasoning,
      confidence,
      alternativesConsidered: options.options.filter(o => o.id !== selectedOption.id),
      timestamp: Date.now()
    };
  }

  /**
   * Ejecuta una acción basada en la decisión tomada
   */
  public async act(decision: Decision): Promise<Action> {
    console.log('🎯 Ejecutando acción decidida...');
    
    const action: Action = {
      id: `action_${Date.now()}`,
      type: decision.selectedOption.action,
      target: 'system',
      parameters: decision.selectedOption,
      status: 'PENDING'
    };
    
    try {
      // Preparar la acción
      action.status = 'EXECUTING';
      
      // Ejecutar la acción
      const result = await this.executeAction(action);
      
      action.status = 'COMPLETED';
      action.result = result;
      
    } catch (error) {
      action.status = 'FAILED';
      action.error = error instanceof Error ? error.message : 'Unknown error';
    }
    
    return action;
  }

  /**
   * Aprende de las experiencias y actualiza el conocimiento
   */
  public async learn(experience: Experience): Promise<Knowledge> {
    console.log('📚 Aprendiendo de la experiencia...');
    
    // Almacenar experiencia
    this.experienceMemory.push(experience);
    this.pruneMemory();
    
    // Extraer patrones de la experiencia
    const newPatterns = await this.extractPatterns(experience);
    
    // Actualizar reglas basadas en el resultado
    const updatedRules = await this.updateRules(experience);
    
    // Ajustar heurísticas
    const updatedHeuristics = await this.adjustHeuristics(experience);
    
    // Actualizar base de conocimiento
    this.knowledgeBase = {
      patterns: [...this.knowledgeBase.patterns, ...newPatterns],
      rules: updatedRules,
      heuristics: updatedHeuristics,
      cases: this.experienceMemory.slice(-100) // Mantener casos recientes
    };
    
    // Aplicar aprendizaje reforzado
    await this.reinforcementLearning(experience);
    
    return this.knowledgeBase;
  }

  /**
   * Detecta patrones en el entorno del sistema
   */
  private async detectPatterns(environment: SystemEnvironment): Promise<Pattern[]> {
    const patterns: Pattern[] = [];
    
    // Patrón de carga
    if (environment.systemLoad > 0.8) {
      patterns.push({
        type: 'HIGH_LOAD',
        confidence: 0.9,
        description: 'Sistema bajo alta carga',
        frequency: 1
      });
    }
    
    // Patrón de tareas pendientes
    if (environment.pendingTasks.length > 10) {
      patterns.push({
        type: 'TASK_BACKLOG',
        confidence: 0.85,
        description: 'Acumulación de tareas pendientes',
        frequency: environment.pendingTasks.length
      });
    }
    
    // Patrón de eventos externos
    const eventTypes = new Set(environment.externalEvents.map(e => e.type));
    if (eventTypes.size > 5) {
      patterns.push({
        type: 'HIGH_EVENT_DIVERSITY',
        confidence: 0.75,
        description: 'Alta diversidad de eventos externos',
        frequency: eventTypes.size
      });
    }
    
    return patterns;
  }

  /**
   * Detecta anomalías en el sistema
   */
  private async detectAnomalies(environment: SystemEnvironment): Promise<Anomaly[]> {
    const anomalies: Anomaly[] = [];
    
    // Anomalía de salud del sistema
    if (environment.systemHealth === 'CRITICAL') {
      anomalies.push({
        severity: 'CRITICAL',
        component: 'system',
        description: 'Sistema en estado crítico',
        detectedAt: Date.now()
      });
    }
    
    // Anomalía de componentes inactivos
    const expectedComponents = ['core', 'wrappers', 'monitors'];
    const missingComponents = expectedComponents.filter(
      c => !environment.activeComponents.includes(c)
    );
    
    if (missingComponents.length > 0) {
      anomalies.push({
        severity: 'HIGH',
        component: missingComponents.join(', '),
        description: `Componentes críticos inactivos: ${missingComponents.join(', ')}`,
        detectedAt: Date.now()
      });
    }
    
    // Anomalía termodinámica
    const thermoState = this.thermodynamicManager.getCurrentState();
    const entropy = this.thermodynamicManager.calculateEntropy();
    
    if (thermoState === ThermoState.ACTIVE && entropy.value > 0.5) {
      anomalies.push({
        severity: 'MEDIUM',
        component: 'thermodynamics',
        description: 'Entropía elevada en estado ACTIVE',
        detectedAt: Date.now()
      });
    }
    
    return anomalies;
  }

  /**
   * Identifica oportunidades de mejora
   */
  private async identifyOpportunities(environment: SystemEnvironment): Promise<Opportunity[]> {
    const opportunities: Opportunity[] = [];
    
    // Oportunidad de optimización
    if (environment.systemLoad < 0.3) {
      opportunities.push({
        type: 'OPTIMIZATION',
        impact: 0.7,
        effort: 0.3,
        description: 'Sistema con capacidad libre para optimizaciones'
      });
    }
    
    // Oportunidad de escalado
    if (environment.pendingTasks.length > 20 && environment.systemLoad > 0.7) {
      opportunities.push({
        type: 'SCALING',
        impact: 0.9,
        effort: 0.5,
        description: 'Escalar recursos para manejar carga de tareas'
      });
    }
    
    return opportunities;
  }

  /**
   * Evalúa amenazas potenciales
   */
  private async assessThreats(environment: SystemEnvironment): Promise<Threat[]> {
    const threats: Threat[] = [];
    
    // Amenaza de rendimiento
    if (environment.systemLoad > 0.9) {
      threats.push({
        type: 'PERFORMANCE',
        severity: 0.8,
        probability: 0.9,
        description: 'Degradación inminente del rendimiento'
      });
    }
    
    // Amenaza de estabilidad
    if (environment.systemHealth === 'DEGRADED') {
      threats.push({
        type: 'STABILITY',
        severity: 0.7,
        probability: 0.6,
        description: 'Riesgo de inestabilidad del sistema'
      });
    }
    
    return threats;
  }

  /**
   * Genera conclusiones basadas en los datos percibidos
   */
  private async generateConclusions(data: PerceptionData): Promise<Conclusion[]> {
    const conclusions: Conclusion[] = [];
    const perception = data.processed;
    
    // Conclusión sobre el estado del sistema
    if (perception.anomalies.length > 2) {
      conclusions.push({
        statement: 'El sistema requiere intervención inmediata',
        evidence: perception.anomalies.map(a => a.description),
        confidence: 0.85
      });
    }
    
    // Conclusión sobre oportunidades
    if (perception.opportunities.length > 0) {
      const highImpact = perception.opportunities.filter(o => o.impact > 0.7);
      if (highImpact.length > 0) {
        conclusions.push({
          statement: 'Existen oportunidades de alto impacto disponibles',
          evidence: highImpact.map(o => o.description),
          confidence: 0.9
        });
      }
    }
    
    return conclusions;
  }

  /**
   * Formula hipótesis basadas en los datos
   */
  private async formulateHypotheses(data: PerceptionData): Promise<Hypothesis[]> {
    const hypotheses: Hypothesis[] = [];
    const perception = data.processed;
    
    // Hipótesis sobre patrones
    if (perception.patterns.some(p => p.type === 'HIGH_LOAD')) {
      hypotheses.push({
        statement: 'La alta carga persistirá en las próximas horas',
        probability: 0.7,
        testable: true
      });
    }
    
    // Hipótesis sobre mejoras
    if (perception.opportunities.length > 2) {
      hypotheses.push({
        statement: 'Implementar optimizaciones mejorará el rendimiento en 30%',
        probability: 0.6,
        testable: true
      });
    }
    
    return hypotheses;
  }

  /**
   * Crea recomendaciones basadas en el razonamiento
   */
  private async createRecommendations(
    data: PerceptionData, 
    conclusions: Conclusion[]
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];
    const perception = data.processed;
    
    // Recomendación basada en anomalías
    if (perception.anomalies.some(a => a.severity === 'CRITICAL')) {
      recommendations.push({
        action: 'Activar protocolo de emergencia',
        priority: 10,
        impact: 0.95,
        reasoning: 'Anomalías críticas detectadas requieren acción inmediata'
      });
    }
    
    // Recomendación basada en oportunidades
    const bestOpp = perception.opportunities.sort((a, b) => 
      (b.impact / b.effort) - (a.impact / a.effort)
    )[0];
    
    if (bestOpp) {
      recommendations.push({
        action: `Implementar ${bestOpp.description}`,
        priority: 7,
        impact: bestOpp.impact,
        reasoning: 'Mejor ratio impacto/esfuerzo disponible'
      });
    }
    
    return recommendations;
  }

  /**
   * Calcula la confianza del razonamiento
   */
  private calculateReasoningConfidence(
    conclusions: Conclusion[], 
    hypotheses: Hypothesis[]
  ): number {
    const avgConclusionConf = conclusions.reduce((sum, c) => sum + c.confidence, 0) / 
                              (conclusions.length || 1);
    const avgHypothesisProb = hypotheses.reduce((sum, h) => sum + h.probability, 0) / 
                              (hypotheses.length || 1);
    
    return (avgConclusionConf + avgHypothesisProb) / 2;
  }

  /**
   * Evalúa las opciones de decisión
   */
  private async evaluateOptions(options: DecisionSpace): Promise<Map<string, number>> {
    const evaluations = new Map<string, number>();
    
    for (const option of options.options) {
      let score = 0;
      
      // Evaluar contra objetivos
      for (const objective of options.objectives) {
        score += this.evaluateAgainstObjective(option, objective);
      }
      
      // Penalizar por riesgos
      score -= option.risks.length * 0.1;
      
      // Bonificar por beneficios
      score += option.benefits.length * 0.15;
      
      // Ajustar por costo
      score -= option.cost * 0.05;
      
      // Verificar restricciones
      const passesConstraints = this.checkConstraints(option, options.constraints);
      if (!passesConstraints) {
        score *= 0.1; // Penalización severa si no cumple restricciones duras
      }
      
      evaluations.set(option.id, score);
    }
    
    return evaluations;
  }

  /**
   * Evalúa una opción contra un objetivo
   */
  private evaluateAgainstObjective(option: DecisionOption, objective: Objective): number {
    // Simulación de evaluación - en producción sería más sofisticado
    return Math.random() * objective.weight;
  }

  /**
   * Verifica si una opción cumple las restricciones
   */
  private checkConstraints(option: DecisionOption, constraints: Constraint[]): boolean {
    for (const constraint of constraints) {
      if (constraint.hard) {
        // Verificación simplificada - en producción sería más compleja
        if (constraint.type === 'RESOURCE' && option.cost > 100) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Selecciona la mejor opción basada en las evaluaciones
   */
  private selectBestOption(
    evaluations: Map<string, number>, 
    options: DecisionSpace
  ): DecisionOption {
    let bestScore = -Infinity;
    let bestOption: DecisionOption | null = null;
    
    for (const option of options.options) {
      const score = evaluations.get(option.id) || 0;
      if (score > bestScore) {
        bestScore = score;
        bestOption = option;
      }
    }
    
    return bestOption || options.options[0];
  }

  /**
   * Genera el razonamiento para la decisión tomada
   */
  private generateDecisionReasoning(
    selected: DecisionOption,
    evaluations: Map<string, number>,
    options: DecisionSpace
  ): string {
    const score = evaluations.get(selected.id) || 0;
    const benefits = selected.benefits.join(', ');
    const objectives = options.objectives.map(o => o.description).join(', ');
    
    return `Opción seleccionada con score ${score.toFixed(2)}. ` +
           `Beneficios principales: ${benefits}. ` +
           `Alineada con objetivos: ${objectives}`;
  }

  /**
   * Calcula la confianza en la decisión
   */
  private calculateDecisionConfidence(
    selected: DecisionOption,
    evaluations: Map<string, number>
  ): number {
    const selectedScore = evaluations.get(selected.id) || 0;
    const scores = Array.from(evaluations.values());
    const maxScore = Math.max(...scores);
    
    // Confianza basada en qué tan clara fue la decisión
    const margin = selectedScore / (maxScore || 1);
    return Math.min(0.95, margin);
  }

  /**
   * Ejecuta la acción decidida
   */
  private async executeAction(action: Action): Promise<any> {
    // Simulación de ejecución - en producción interactuaría con el sistema real
    console.log(`⚡ Ejecutando: ${action.type}`);
    
    // Simular delay de ejecución
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      timestamp: Date.now(),
      impact: 'Action executed successfully'
    };
  }

  /**
   * Extrae patrones de una experiencia
   */
  private async extractPatterns(experience: Experience): Promise<Pattern[]> {
    const patterns: Pattern[] = [];
    
    // Extraer patrón de éxito/fracaso
    if (experience.outcome.success) {
      patterns.push({
        type: 'SUCCESSFUL_ACTION',
        confidence: 0.8,
        description: `Acción ${experience.action.type} exitosa`,
        frequency: 1
      });
    }
    
    return patterns;
  }

  /**
   * Actualiza las reglas basadas en la experiencia
   */
  private async updateRules(experience: Experience): Promise<Rule[]> {
    const rules = [...this.knowledgeBase.rules];
    
    // Crear nueva regla si la experiencia fue exitosa
    if (experience.outcome.success && experience.decision.confidence > 0.8) {
      const newRule: Rule = {
        condition: `Percepción similar a ${experience.perception.patterns[0]?.type}`,
        action: experience.action.type,
        confidence: experience.decision.confidence,
        exceptions: []
      };
      rules.push(newRule);
    }
    
    return rules;
  }

  /**
   * Ajusta las heurísticas basadas en la experiencia
   */
  private async adjustHeuristics(experience: Experience): Promise<Heuristic[]> {
    const heuristics = [...this.knowledgeBase.heuristics];
    
    // Buscar heurística relacionada
    const related = heuristics.find(h => 
      h.situation === experience.perception.patterns[0]?.type
    );
    
    if (related) {
      // Actualizar tasa de éxito
      const factor = experience.outcome.success ? 1.1 : 0.9;
      related.successRate = Math.min(1, related.successRate * factor);
      related.lastUpdated = Date.now();
    } else {
      // Crear nueva heurística
      heuristics.push({
        situation: experience.perception.patterns[0]?.type || 'unknown',
        approach: experience.action.type,
        successRate: experience.outcome.success ? 0.7 : 0.3,
        lastUpdated: Date.now()
      });
    }
    
    return heuristics;
  }

  /**
   * Aplica aprendizaje reforzado
   */
  private async reinforcementLearning(experience: Experience): Promise<void> {
    // Ajustar pesos internos basados en el resultado
    const reward = experience.outcome.success ? 1 : -1;
    const impactFactor = experience.outcome.impact;
    
    // Actualizar modelo de decisión (simplificado)
    this.consciousness.adjustWeights(reward * impactFactor * this.learningRate);
  }

  /**
   * Inicializa la base de conocimiento
   */
  private initializeKnowledge(): Knowledge {
    return {
      patterns: [],
      rules: [
        {
          condition: 'systemLoad > 0.9',
          action: 'scaleResources',
          confidence: 0.9,
          exceptions: ['resourcesAtMax']
        }
      ],
      heuristics: [
        {
          situation: 'HIGH_LOAD',
          approach: 'distributeLoad',
          successRate: 0.75,
          lastUpdated: Date.now()
        }
      ],
      cases: []
    };
  }

  /**
   * Inicia el ciclo de consciencia continuo
   */
  private startConsciousnessLoop(): void {
    setInterval(async () => {
      // Ciclo de consciencia autónomo
      const environment = await this.getCurrentEnvironment();
      const perception = await this.perceive(environment);
      
      if (this.consciousness.getAwarenessLevel() > this.awarenessThreshold) {
        const perceptionData: PerceptionData = {
          raw: environment,
          processed: perception,
          confidence: 0.85
        };
        
        const reasoning = await this.reason(perceptionData);
        
        if (reasoning.confidence > this.decisionThreshold) {
          // Tomar acción si hay alta confianza
          console.log('🎭 Ciclo de consciencia activo - evaluando acciones...');
        }
      }
    }, 10000); // Cada 10 segundos
  }

  /**
   * Obtiene el estado actual del entorno
   */
  private async getCurrentEnvironment(): Promise<SystemEnvironment> {
    // En producción, esto obtendría datos reales del sistema
    return {
      timestamp: Date.now(),
      systemLoad: Math.random(),
      activeComponents: ['core', 'wrappers', 'monitors'],
      pendingTasks: [],
      systemHealth: Math.random() > 0.2 ? 'HEALTHY' : 'DEGRADED',
      externalEvents: []
    };
  }

  /**
   * Limpia la memoria de experiencias
   */
  private pruneMemory(): void {
    if (this.experienceMemory.length > this.maxMemorySize) {
      // Mantener experiencias más relevantes
      this.experienceMemory = this.experienceMemory
        .sort((a, b) => b.outcome.impact - a.outcome.impact)
        .slice(0, this.maxMemorySize);
    }
  }

  /**
   * Obtiene el nivel actual de consciencia
   */
  public getConsciousnessLevel(): number {
    return this.consciousness.getAwarenessLevel();
  }

  /**
   * Obtiene un reporte del estado de consciencia
   */
  public getConsciousnessReport() {
    return {
      awarenessLevel: this.consciousness.getAwarenessLevel(),
      knowledgePatterns: this.knowledgeBase.patterns.length,
      knowledgeRules: this.knowledgeBase.rules.length,
      knowledgeHeuristics: this.knowledgeBase.heuristics.length,
      experienceCount: this.experienceMemory.length,
      lastPerception: this.consciousness.getLastPerception()
    };
  }
}

/**
 * Núcleo de consciencia del sistema
 */
class ConsciousnessCore {
  private awarenessLevel: number = 0.5;
  private lastPerception: Perception | null = null;
  private weights: Map<string, number> = new Map();

  /**
   * Actualiza el nivel de consciencia basado en la percepción
   */
  public updateAwareness(perception: Perception): void {
    // Aumentar consciencia basado en la complejidad de la percepción
    const complexity = perception.patterns.length + 
                      perception.anomalies.length + 
                      perception.opportunities.length + 
                      perception.threats.length;
    
    this.awarenessLevel = Math.min(1, this.awarenessLevel + complexity * 0.01);
    this.lastPerception = perception;
    
    // Decay natural de la consciencia
    setTimeout(() => {
      this.awarenessLevel *= 0.99;
    }, 1000);
  }

  /**
   * Ajusta los pesos internos del modelo
   */
  public adjustWeights(delta: number): void {
    for (const [key, value] of this.weights.entries()) {
      this.weights.set(key, value + delta);
    }
  }

  /**
   * Obtiene el nivel actual de consciencia
   */
  public getAwarenessLevel(): number {
    return this.awarenessLevel;
  }

  /**
   * Obtiene la última percepción
   */
  public getLastPerception(): Perception | null {
    return this.lastPerception;
  }
}

// Exportar tipos para uso externo
export { LivingCodeLayer, ConsciousnessCore };