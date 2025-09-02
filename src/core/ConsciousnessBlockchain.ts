/**
 * Consciousness Blockchain - Auditoría Inmutable de Decisiones
 * 
 * Implementa una blockchain de consciencia que mantiene un registro
 * inmutable de todas las decisiones, razonamientos y justificaciones
 * éticas del sistema BRIK v5.
 * 
 * @module ConsciousnessBlockchain
 * @version 1.0.0
 * @certification L4
 */

import * as crypto from 'crypto';

export interface ConsciousnessBlock {
  index: number;
  timestamp: number;
  decision: DecisionRecord;
  reasoning: ReasoningRecord;
  ethicalJustification: EthicalRecord;
  previousHash: string;
  hash: string;
  nonce: number;
  signature?: string;
}

export interface DecisionRecord {
  id: string;
  type: 'OPERATIONAL' | 'STRATEGIC' | 'ETHICAL' | 'EMERGENCY';
  action: string;
  target: string;
  parameters: any;
  confidence: number;
  alternatives: string[];
}

export interface ReasoningRecord {
  premises: string[];
  logic: LogicChain[];
  conclusions: string[];
  evidence: Evidence[];
  confidence: number;
}

export interface LogicChain {
  step: number;
  statement: string;
  justification: string;
  confidence: number;
}

export interface Evidence {
  type: 'METRIC' | 'PATTERN' | 'HISTORICAL' | 'RULE';
  source: string;
  data: any;
  weight: number;
}

export interface EthicalRecord {
  principles: EthicalPrinciple[];
  evaluation: EthicalEvaluation;
  conflicts: EthicalConflict[];
  resolution: string;
  compliance: ComplianceCheck[];
}

export interface EthicalPrinciple {
  name: string;
  description: string;
  weight: number;
  satisfied: boolean;
}

export interface EthicalEvaluation {
  benefitScore: number;
  harmScore: number;
  fairnessScore: number;
  transparencyScore: number;
  overallScore: number;
}

export interface EthicalConflict {
  principle1: string;
  principle2: string;
  description: string;
  resolution: string;
}

export interface ComplianceCheck {
  regulation: string;
  requirement: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'UNCERTAIN';
  evidence: string;
}

export interface BlockchainStats {
  totalBlocks: number;
  totalDecisions: number;
  averageConfidence: number;
  ethicalCompliance: number;
  chainIntegrity: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Implementación de la Blockchain de Consciencia
 */
export class ConsciousnessBlockchain {
  private chain: ConsciousnessBlock[] = [];
  private pendingDecisions: ConsciousnessBlock[] = [];
  private readonly difficulty = 4; // Número de ceros requeridos en el hash
  private readonly miningReward = 100;
  private readonly maxBlockSize = 10;
  
  // Principios éticos fundamentales del sistema
  private readonly ethicalPrinciples = [
    'Preservación de la coherencia sistémica',
    'Beneficio del ecosistema sobre componente individual',
    'Transparencia en procesos de decisión',
    'Respeto por la autonomía de otros agentes',
    'Prevención del daño sistémico',
    'Conservación de la diversidad computacional'
  ];

  constructor() {
    this.createGenesisBlock();
  }

  /**
   * Crea el bloque génesis de la blockchain
   */
  private createGenesisBlock(): void {
    const genesisDecision: DecisionRecord = {
      id: 'genesis',
      type: 'OPERATIONAL',
      action: 'INITIALIZE_CONSCIOUSNESS',
      target: 'system',
      parameters: { version: '1.0.0', timestamp: Date.now() },
      confidence: 1.0,
      alternatives: []
    };

    const genesisReasoning: ReasoningRecord = {
      premises: ['Sistema requiere inicialización'],
      logic: [{
        step: 1,
        statement: 'Blockchain de consciencia necesaria para auditoría',
        justification: 'Requisito L4 de trazabilidad completa',
        confidence: 1.0
      }],
      conclusions: ['Blockchain inicializada correctamente'],
      evidence: [{
        type: 'RULE',
        source: 'L4_CERTIFICATION',
        data: 'Requirement: Full decision traceability',
        weight: 1.0
      }],
      confidence: 1.0
    };

    const genesisEthics: EthicalRecord = {
      principles: this.ethicalPrinciples.map(p => ({
        name: p,
        description: p,
        weight: 1.0,
        satisfied: true
      })),
      evaluation: {
        benefitScore: 1.0,
        harmScore: 0.0,
        fairnessScore: 1.0,
        transparencyScore: 1.0,
        overallScore: 1.0
      },
      conflicts: [],
      resolution: 'No conflicts in genesis block',
      compliance: [{
        regulation: 'BRIK_V5',
        requirement: 'Consciousness blockchain required',
        status: 'COMPLIANT',
        evidence: 'Genesis block created'
      }]
    };

    const genesisBlock: ConsciousnessBlock = {
      index: 0,
      timestamp: Date.now(),
      decision: genesisDecision,
      reasoning: genesisReasoning,
      ethicalJustification: genesisEthics,
      previousHash: '0',
      hash: '',
      nonce: 0
    };

    genesisBlock.hash = this.calculateHash(genesisBlock);
    this.chain.push(genesisBlock);
  }

  /**
   * Registra una decisión en la blockchain
   */
  public async recordDecision(
    decision: DecisionRecord,
    reasoning: ReasoningRecord,
    ethics?: EthicalRecord
  ): Promise<ConsciousnessBlock> {
    console.log('📝 Registrando decisión en blockchain de consciencia...');
    
    // Si no se proporciona evaluación ética, generarla
    const ethicalJustification = ethics || await this.generateEthicalJustification(decision);
    
    // Crear nuevo bloque
    const newBlock: ConsciousnessBlock = {
      index: this.chain.length,
      timestamp: Date.now(),
      decision,
      reasoning,
      ethicalJustification,
      previousHash: this.getLatestBlock().hash,
      hash: '',
      nonce: 0
    };

    // Minar el bloque
    this.mineBlock(newBlock);
    
    // Validar integridad antes de agregar
    if (this.validateBlock(newBlock)) {
      this.chain.push(newBlock);
      console.log('✅ Decisión registrada en bloque #' + newBlock.index);
      
      // Emitir evento para sistemas de monitoreo
      this.emitBlockAddedEvent(newBlock);
      
      return newBlock;
    } else {
      throw new Error('Bloque inválido, no se puede agregar a la cadena');
    }
  }

  /**
   * Genera justificación ética para una decisión
   */
  private async generateEthicalJustification(decision: DecisionRecord): Promise<EthicalRecord> {
    const principles: EthicalPrinciple[] = [];
    const conflicts: EthicalConflict[] = [];
    
    // Evaluar cada principio ético
    for (const principleName of this.ethicalPrinciples) {
      const satisfied = await this.evaluatePrinciple(principleName, decision);
      principles.push({
        name: principleName,
        description: principleName,
        weight: 1.0,
        satisfied
      });
    }
    
    // Calcular scores éticos
    const evaluation: EthicalEvaluation = {
      benefitScore: this.calculateBenefitScore(decision),
      harmScore: this.calculateHarmScore(decision),
      fairnessScore: this.calculateFairnessScore(decision),
      transparencyScore: decision.confidence, // Confianza como proxy de transparencia
      overallScore: 0
    };
    
    evaluation.overallScore = (
      evaluation.benefitScore * 0.3 +
      (1 - evaluation.harmScore) * 0.3 +
      evaluation.fairnessScore * 0.2 +
      evaluation.transparencyScore * 0.2
    );
    
    // Verificar conflictos éticos
    if (decision.type === 'EMERGENCY') {
      conflicts.push({
        principle1: 'Transparencia en procesos',
        principle2: 'Prevención del daño sistémico',
        description: 'Acción de emergencia puede requerir decisión rápida sin transparencia completa',
        resolution: 'Priorizar prevención del daño, documentar post-facto'
      });
    }
    
    // Verificar cumplimiento
    const compliance: ComplianceCheck[] = [
      {
        regulation: 'BRIK_V5',
        requirement: 'All decisions must be traceable',
        status: 'COMPLIANT',
        evidence: 'Decision recorded in blockchain'
      },
      {
        regulation: 'ETHICAL_AI',
        requirement: 'Decisions must consider system-wide impact',
        status: evaluation.overallScore > 0.6 ? 'COMPLIANT' : 'NON_COMPLIANT',
        evidence: `Ethical score: ${evaluation.overallScore.toFixed(2)}`
      }
    ];
    
    return {
      principles,
      evaluation,
      conflicts,
      resolution: conflicts.length > 0 ? 
        'Conflicts resolved through weighted prioritization' : 
        'No ethical conflicts detected',
      compliance
    };
  }

  /**
   * Evalúa si una decisión satisface un principio ético
   */
  private async evaluatePrinciple(principle: string, decision: DecisionRecord): Promise<boolean> {
    // Evaluación simplificada - en producción sería más sofisticada
    switch (principle) {
      case 'Preservación de la coherencia sistémica':
        return decision.type !== 'EMERGENCY';
      
      case 'Beneficio del ecosistema sobre componente individual':
        return decision.confidence > 0.7;
      
      case 'Transparencia en procesos de decisión':
        return decision.alternatives.length > 0;
      
      case 'Respeto por la autonomía de otros agentes':
        return !decision.action.includes('override');
      
      case 'Prevención del daño sistémico':
        return decision.type === 'EMERGENCY' || decision.confidence > 0.6;
      
      case 'Conservación de la diversidad computacional':
        return decision.alternatives.length > 1;
      
      default:
        return true;
    }
  }

  /**
   * Calcula el score de beneficio de una decisión
   */
  private calculateBenefitScore(decision: DecisionRecord): number {
    let score = decision.confidence;
    
    // Bonus por tipo de decisión
    if (decision.type === 'STRATEGIC') score += 0.1;
    if (decision.type === 'ETHICAL') score += 0.15;
    
    return Math.min(1.0, score);
  }

  /**
   * Calcula el score de daño potencial
   */
  private calculateHarmScore(decision: DecisionRecord): number {
    let score = 0;
    
    // Penalización por acciones de emergencia
    if (decision.type === 'EMERGENCY') score += 0.3;
    
    // Penalización por baja confianza
    if (decision.confidence < 0.5) score += 0.2;
    
    // Penalización por falta de alternativas
    if (decision.alternatives.length === 0) score += 0.1;
    
    return Math.min(1.0, score);
  }

  /**
   * Calcula el score de equidad
   */
  private calculateFairnessScore(decision: DecisionRecord): number {
    // Score basado en consideración de alternativas
    const alternativeScore = Math.min(decision.alternatives.length / 5, 1.0);
    
    // Score basado en tipo de decisión
    const typeScore = decision.type === 'ETHICAL' ? 1.0 : 0.7;
    
    return (alternativeScore + typeScore) / 2;
  }

  /**
   * Calcula el hash de un bloque
   */
  private calculateHash(block: ConsciousnessBlock): string {
    const data = block.index + 
                block.timestamp + 
                JSON.stringify(block.decision) + 
                JSON.stringify(block.reasoning) + 
                JSON.stringify(block.ethicalJustification) + 
                block.previousHash + 
                block.nonce;
    
    return crypto.createHash('sha3-512').update(data).digest('hex');
  }

  /**
   * Mina un bloque (Proof of Work)
   */
  private mineBlock(block: ConsciousnessBlock): void {
    const startTime = Date.now();
    const target = '0'.repeat(this.difficulty);
    
    while (block.hash.substring(0, this.difficulty) !== target) {
      block.nonce++;
      block.hash = this.calculateHash(block);
    }
    
    const miningTime = Date.now() - startTime;
    console.log(`⛏️ Bloque minado en ${miningTime}ms con nonce ${block.nonce}`);
  }

  /**
   * Valida un bloque individual
   */
  private validateBlock(block: ConsciousnessBlock): boolean {
    // Verificar hash
    if (block.hash !== this.calculateHash(block)) {
      console.error('❌ Hash inválido en bloque', block.index);
      return false;
    }
    
    // Verificar dificultad
    if (block.hash.substring(0, this.difficulty) !== '0'.repeat(this.difficulty)) {
      console.error('❌ Dificultad no cumplida en bloque', block.index);
      return false;
    }
    
    // Verificar enlace con bloque anterior
    if (block.index > 0) {
      const previousBlock = this.chain[block.index - 1];
      if (block.previousHash !== previousBlock.hash) {
        console.error('❌ Hash anterior inválido en bloque', block.index);
        return false;
      }
    }
    
    return true;
  }

  /**
   * Valida la integridad completa de la blockchain
   */
  public validateChain(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      
      // Verificar hash del bloque
      if (currentBlock.hash !== this.calculateHash(currentBlock)) {
        errors.push(`Bloque ${i}: Hash inválido`);
      }
      
      // Verificar enlace con bloque anterior
      if (currentBlock.previousHash !== previousBlock.hash) {
        errors.push(`Bloque ${i}: Enlace con bloque anterior roto`);
      }
      
      // Verificar timestamps
      if (currentBlock.timestamp <= previousBlock.timestamp) {
        warnings.push(`Bloque ${i}: Timestamp no incremental`);
      }
      
      // Verificar ética
      if (currentBlock.ethicalJustification.evaluation.overallScore < 0.5) {
        warnings.push(`Bloque ${i}: Score ético bajo (${currentBlock.ethicalJustification.evaluation.overallScore})`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Obtiene el último bloque de la cadena
   */
  private getLatestBlock(): ConsciousnessBlock {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Obtiene estadísticas de la blockchain
   */
  public getStatistics(): BlockchainStats {
    const totalBlocks = this.chain.length;
    const totalDecisions = totalBlocks - 1; // Excluir génesis
    
    let totalConfidence = 0;
    let totalEthicalScore = 0;
    
    for (let i = 1; i < this.chain.length; i++) {
      totalConfidence += this.chain[i].decision.confidence;
      totalEthicalScore += this.chain[i].ethicalJustification.evaluation.overallScore;
    }
    
    const validation = this.validateChain();
    
    return {
      totalBlocks,
      totalDecisions,
      averageConfidence: totalDecisions > 0 ? totalConfidence / totalDecisions : 0,
      ethicalCompliance: totalDecisions > 0 ? totalEthicalScore / totalDecisions : 1,
      chainIntegrity: validation.valid
    };
  }

  /**
   * Busca decisiones por criterios
   */
  public searchDecisions(criteria: {
    type?: string;
    minConfidence?: number;
    startTime?: number;
    endTime?: number;
  }): ConsciousnessBlock[] {
    return this.chain.filter(block => {
      if (block.index === 0) return false; // Excluir génesis
      
      if (criteria.type && block.decision.type !== criteria.type) return false;
      if (criteria.minConfidence && block.decision.confidence < criteria.minConfidence) return false;
      if (criteria.startTime && block.timestamp < criteria.startTime) return false;
      if (criteria.endTime && block.timestamp > criteria.endTime) return false;
      
      return true;
    });
  }

  /**
   * Obtiene el historial de decisiones éticas
   */
  public getEthicalHistory(): Array<{
    index: number;
    timestamp: number;
    decision: string;
    ethicalScore: number;
    conflicts: number;
    compliance: string;
  }> {
    return this.chain.slice(1).map(block => ({
      index: block.index,
      timestamp: block.timestamp,
      decision: block.decision.action,
      ethicalScore: block.ethicalJustification.evaluation.overallScore,
      conflicts: block.ethicalJustification.conflicts.length,
      compliance: block.ethicalJustification.compliance.every(c => c.status === 'COMPLIANT') ? 
        'FULL' : 'PARTIAL'
    }));
  }

  /**
   * Exporta la blockchain a formato JSON
   */
  public exportToJSON(): string {
    return JSON.stringify(this.chain, null, 2);
  }

  /**
   * Importa una blockchain desde JSON
   */
  public importFromJSON(jsonData: string): ValidationResult {
    try {
      const importedChain = JSON.parse(jsonData) as ConsciousnessBlock[];
      
      // Validar la cadena importada
      const tempBlockchain = new ConsciousnessBlockchain();
      tempBlockchain.chain = importedChain;
      
      const validation = tempBlockchain.validateChain();
      
      if (validation.valid) {
        this.chain = importedChain;
        console.log('✅ Blockchain importada correctamente');
      }
      
      return validation;
    } catch (error) {
      return {
        valid: false,
        errors: ['Error parsing JSON: ' + (error instanceof Error ? error.message : 'Unknown')],
        warnings: []
      };
    }
  }

  /**
   * Emite evento cuando se agrega un bloque
   */
  private emitBlockAddedEvent(block: ConsciousnessBlock): void {
    // En producción, esto emitiría a un sistema de eventos
    console.log(`📢 Evento: Nuevo bloque #${block.index} agregado a la blockchain`);
  }

  /**
   * Obtiene la cadena completa (solo lectura)
   */
  public getChain(): ReadonlyArray<ConsciousnessBlock> {
    return [...this.chain];
  }

  /**
   * Genera un reporte forense de una decisión
   */
  public generateForensicReport(blockIndex: number): string {
    if (blockIndex < 0 || blockIndex >= this.chain.length) {
      return 'Bloque no encontrado';
    }
    
    const block = this.chain[blockIndex];
    
    return `
╔════════════════════════════════════════════════════════════════╗
║                   REPORTE FORENSE DE DECISIÓN                  ║
╚════════════════════════════════════════════════════════════════╝

📋 METADATOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bloque #: ${block.index}
Timestamp: ${new Date(block.timestamp).toISOString()}
Hash: ${block.hash}
Hash Anterior: ${block.previousHash}

🎯 DECISIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ID: ${block.decision.id}
Tipo: ${block.decision.type}
Acción: ${block.decision.action}
Target: ${block.decision.target}
Confianza: ${(block.decision.confidence * 100).toFixed(1)}%
Alternativas consideradas: ${block.decision.alternatives.length}

🧠 RAZONAMIENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Premisas:
${block.reasoning.premises.map(p => '  • ' + p).join('\n')}

Cadena Lógica:
${block.reasoning.logic.map(l => `  ${l.step}. ${l.statement} (${(l.confidence * 100).toFixed(0)}%)`).join('\n')}

Conclusiones:
${block.reasoning.conclusions.map(c => '  ✓ ' + c).join('\n')}

⚖️ JUSTIFICACIÓN ÉTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Score de Beneficio: ${(block.ethicalJustification.evaluation.benefitScore * 100).toFixed(1)}%
Score de Daño: ${(block.ethicalJustification.evaluation.harmScore * 100).toFixed(1)}%
Score de Equidad: ${(block.ethicalJustification.evaluation.fairnessScore * 100).toFixed(1)}%
Score de Transparencia: ${(block.ethicalJustification.evaluation.transparencyScore * 100).toFixed(1)}%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCORE ÉTICO TOTAL: ${(block.ethicalJustification.evaluation.overallScore * 100).toFixed(1)}%

Conflictos Éticos: ${block.ethicalJustification.conflicts.length > 0 ? 
  block.ethicalJustification.conflicts.map(c => c.description).join(', ') : 'Ninguno'}

Cumplimiento Regulatorio:
${block.ethicalJustification.compliance.map(c => `  ${c.status === 'COMPLIANT' ? '✅' : '❌'} ${c.regulation}: ${c.requirement}`).join('\n')}

═══════════════════════════════════════════════════════════════════
    `;
  }
}

// Singleton para gestión global
let consciousnessBlockchain: ConsciousnessBlockchain | null = null;

export function getConsciousnessBlockchain(): ConsciousnessBlockchain {
  if (!consciousnessBlockchain) {
    consciousnessBlockchain = new ConsciousnessBlockchain();
  }
  return consciousnessBlockchain;
}

// Exportar tipos para uso externo
export { ConsciousnessBlockchain };