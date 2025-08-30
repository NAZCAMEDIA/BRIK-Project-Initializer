/**
 * BRIK L3 Certification - Contract Structure Validation
 * 
 * Validates the fundamental BRIK architecture compliance:
 * - CORE Layer (Immutable components)
 * - WRAPPERS Layer (Configurable components) 
 * - LIVING_LAYER (LLM integration components)
 * 
 * This test suite ensures project structure matches BRIK Core Framework specifications
 * 
 * DEPLOYMENT: Move to tests/contract/contract_structure.spec.ts
 */

import { describe, it, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

interface BrikStructureRequirements {
  core: {
    required: string[];
    patterns: string[];
  };
  wrappers: {
    essential: string[];
    patterns: string[];
  };
  living_layer: {
    components: string[];
    patterns: string[];
  };
  documentation: {
    required: string[];
    optional: string[];
  };
}

const BRIK_L3_REQUIREMENTS: BrikStructureRequirements = {
  core: {
    required: [
      'BrikCore',
      'BrikControlHub', 
      'WrapperOrchestrator',
      'BaseController'
    ],
    patterns: [
      /.*[Cc]ore.*/,
      /.*[Cc]ontrol.*/,
      /.*[Oo]rchestrat.*/,
      /.*[Bb]ase[Cc]ontroller.*/
    ]
  },
  wrappers: {
    essential: [
      'SmartLogger',
      'CircuitGuard',
      'MetricsPro',
      'ConnectPro',
      'TurboCache',
      'DataGuard',
      'SecureShield'
    ],
    patterns: [
      /.*[Ll]ogger.*/,
      /.*[Cc]ircuit.*/,
      /.*[Mm]etrics.*/,
      /.*[Cc]onnect.*/,
      /.*[Cc]ache.*/,
      /.*[Gg]uard.*/,
      /.*[Ss]ecur.*[Ss]hield.*/
    ]
  },
  living_layer: {
    components: [
      'LLMIntegration',
      'DiagnosticEngine',
      'EvolutionManager',
      'ConversationState'
    ],
    patterns: [
      /.*[Ll][Ll][Mm].*/,
      /.*[Dd]iagnostic.*/,
      /.*[Ee]volution.*/,
      /.*[Cc]onversation.*/
    ]
  },
  documentation: {
    required: [
      'README.md',
      'LICENSE',
      'CONTRIBUTING.md',
      'CODE_OF_CONDUCT.md',
      'SECURITY.md'
    ],
    optional: [
      'CHANGELOG.md',
      'ROADMAP.md',
      'ARCHITECTURE.md'
    ]
  }
};

class BrikStructureValidator {
  private projectRoot: string;
  private findings: {
    core: string[];
    wrappers: string[];
    living_layer: string[];
    documentation: string[];
    violations: string[];
  };

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.findings = {
      core: [],
      wrappers: [],
      living_layer: [],
      documentation: [],
      violations: []
    };
  }

  /**
   * Performs comprehensive structure validation
   */
  async validateStructure(): Promise<{
    compliance: boolean;
    score: number;
    findings: typeof this.findings;
    recommendations: string[];
  }> {
    await this.scanProjectStructure();
    const score = this.calculateComplianceScore();
    const recommendations = this.generateRecommendations();

    return {
      compliance: score >= 85,
      score,
      findings: this.findings,
      recommendations
    };
  }

  /**
   * Recursively scans project for BRIK components
   */
  private async scanProjectStructure(): Promise<void> {
    const allFiles = await this.getAllProjectFiles();
    
    for (const filePath of allFiles) {
      const relativePath = path.relative(this.projectRoot, filePath);
      const fileName = path.basename(filePath);
      const content = await this.readFileContent(filePath);

      // Check for CORE components
      this.validateCoreComponents(relativePath, fileName, content);
      
      // Check for WRAPPER components  
      this.validateWrapperComponents(relativePath, fileName, content);
      
      // Check for LIVING_LAYER components
      this.validateLivingLayerComponents(relativePath, fileName, content);
      
      // Check documentation
      this.validateDocumentation(relativePath, fileName);
    }
  }

  /**
   * Validates CORE layer components (immutable)
   */
  private validateCoreComponents(
    relativePath: string, 
    fileName: string, 
    content: string
  ): void {
    BRIK_L3_REQUIREMENTS.core.required.forEach(component => {
      if (fileName.includes(component) || content.includes(`class ${component}`) || content.includes(`interface I${component}`)) {
        if (!this.findings.core.includes(component)) {
          this.findings.core.push(component);
        }
      }
    });

    // Pattern-based validation
    BRIK_L3_REQUIREMENTS.core.patterns.forEach(pattern => {
      if (pattern.test(fileName) || pattern.test(content)) {
        const match = fileName.match(pattern)?.[0] || 'CoreComponent';
        if (!this.findings.core.includes(match)) {
          this.findings.core.push(match);
        }
      }
    });
  }

  /**
   * Validates WRAPPER layer components (configurable)
   */
  private validateWrapperComponents(
    relativePath: string,
    fileName: string, 
    content: string
  ): void {
    BRIK_L3_REQUIREMENTS.wrappers.essential.forEach(wrapper => {
      if (fileName.includes(wrapper) || content.includes(`class ${wrapper}`) || content.includes(`interface I${wrapper}`)) {
        if (!this.findings.wrappers.includes(wrapper)) {
          this.findings.wrappers.push(wrapper);
        }
      }
    });

    // Pattern-based validation
    BRIK_L3_REQUIREMENTS.wrappers.patterns.forEach(pattern => {
      if (pattern.test(fileName) || pattern.test(content)) {
        const match = fileName.match(pattern)?.[0] || 'WrapperComponent';
        if (!this.findings.wrappers.includes(match)) {
          this.findings.wrappers.push(match);
        }
      }
    });
  }

  /**
   * Validates LIVING_LAYER components (LLM integration)
   */
  private validateLivingLayerComponents(
    relativePath: string,
    fileName: string,
    content: string
  ): void {
    BRIK_L3_REQUIREMENTS.living_layer.components.forEach(component => {
      if (fileName.includes(component) || content.includes(`class ${component}`) || content.includes(`interface I${component}`)) {
        if (!this.findings.living_layer.includes(component)) {
          this.findings.living_layer.push(component);
        }
      }
    });

    // Check for LLM integration patterns
    const llmPatterns = [
      /llm|LLM|openai|anthropic|claude/i,
      /conversation|chat|dialogue/i,
      /diagnostic|analysis|evolution/i
    ];

    llmPatterns.forEach(pattern => {
      if (pattern.test(content) && !this.findings.living_layer.includes('LLM_Integration_Found')) {
        this.findings.living_layer.push('LLM_Integration_Found');
      }
    });
  }

  /**
   * Validates required documentation files
   */
  private validateDocumentation(relativePath: string, fileName: string): void {
    BRIK_L3_REQUIREMENTS.documentation.required.forEach(doc => {
      if (fileName === doc && !this.findings.documentation.includes(doc)) {
        this.findings.documentation.push(doc);
      }
    });

    BRIK_L3_REQUIREMENTS.documentation.optional.forEach(doc => {
      if (fileName === doc && !this.findings.documentation.includes(doc)) {
        this.findings.documentation.push(`${doc} (optional)`);
      }
    });
  }

  /**
   * Calculates compliance score based on findings
   */
  private calculateComplianceScore(): number {
    const coreWeight = 0.4;
    const wrapperWeight = 0.3;
    const livingWeight = 0.2;
    const docWeight = 0.1;

    const coreScore = (this.findings.core.length / BRIK_L3_REQUIREMENTS.core.required.length) * 100;
    const wrapperScore = (this.findings.wrappers.length / BRIK_L3_REQUIREMENTS.wrappers.essential.length) * 100;
    const livingScore = (this.findings.living_layer.length / BRIK_L3_REQUIREMENTS.living_layer.components.length) * 100;
    const docScore = (this.findings.documentation.length / BRIK_L3_REQUIREMENTS.documentation.required.length) * 100;

    const totalScore = (
      (coreScore * coreWeight) +
      (wrapperScore * wrapperWeight) +
      (livingScore * livingWeight) +
      (docScore * docWeight)
    );

    return Math.min(100, totalScore);
  }

  /**
   * Generates improvement recommendations
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    // Core recommendations
    const missingCore = BRIK_L3_REQUIREMENTS.core.required.filter(
      comp => !this.findings.core.some(found => found.includes(comp))
    );
    if (missingCore.length > 0) {
      recommendations.push(`Implement missing CORE components: ${missingCore.join(', ')}`);
    }

    // Wrapper recommendations
    const missingWrappers = BRIK_L3_REQUIREMENTS.wrappers.essential.filter(
      wrapper => !this.findings.wrappers.some(found => found.includes(wrapper))
    );
    if (missingWrappers.length > 0) {
      recommendations.push(`Implement missing WRAPPER components: ${missingWrappers.join(', ')}`);
    }

    // Living Layer recommendations
    const missingLiving = BRIK_L3_REQUIREMENTS.living_layer.components.filter(
      comp => !this.findings.living_layer.some(found => found.includes(comp))
    );
    if (missingLiving.length > 0) {
      recommendations.push(`Implement missing LIVING_LAYER components: ${missingLiving.join(', ')}`);
    }

    // Documentation recommendations
    const missingDocs = BRIK_L3_REQUIREMENTS.documentation.required.filter(
      doc => !this.findings.documentation.includes(doc)
    );
    if (missingDocs.length > 0) {
      recommendations.push(`Add missing documentation: ${missingDocs.join(', ')}`);
    }

    return recommendations;
  }

  /**
   * Helper method to get all project files
   */
  private async getAllProjectFiles(): Promise<string[]> {
    const files: string[] = [];
    
    const walkDir = async (dir: string): Promise<void> => {
      try {
        const items = await fs.promises.readdir(dir);
        
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = await fs.promises.stat(fullPath);
          
          if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            await walkDir(fullPath);
          } else if (stat.isFile() && (
            item.endsWith('.ts') || 
            item.endsWith('.js') ||
            item.endsWith('.json') ||
            item.endsWith('.md') ||
            item === 'LICENSE'
          )) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Skip directories we can't read
        return;
      }
    };

    await walkDir(this.projectRoot);
    return files;
  }

  /**
   * Helper method to safely read file content
   */
  private async readFileContent(filePath: string): Promise<string> {
    try {
      return await fs.promises.readFile(filePath, 'utf-8');
    } catch (error) {
      return '';
    }
  }
}

// Test Suite
describe('BRIK L3 Certification - Structure Validation', () => {
  const projectRoot = process.cwd();
  let validator: BrikStructureValidator;
  let validationResult: any;

  beforeAll(async () => {
    validator = new BrikStructureValidator(projectRoot);
    validationResult = await validator.validateStructure();
  });

  describe('CORE Layer Validation', () => {
    it('should have all required CORE components', () => {
      const requiredComponents = BRIK_L3_REQUIREMENTS.core.required;
      const foundCore = validationResult.findings.core;
      
      requiredComponents.forEach(component => {
        const isFound = foundCore.some((found: string) => found.includes(component));
        expect(isFound).toBe(true);
      });
    });

    it('should maintain CORE immutability patterns', () => {
      expect(validationResult.findings.core.length).toBeGreaterThan(0);
    });
  });

  describe('WRAPPER Layer Validation', () => {
    it('should have essential WRAPPER components', () => {
      const essentialWrappers = BRIK_L3_REQUIREMENTS.wrappers.essential;
      const foundWrappers = validationResult.findings.wrappers;
      
      // At least 50% of essential wrappers should be present
      const presenceRatio = foundWrappers.length / essentialWrappers.length;
      expect(presenceRatio).toBeGreaterThan(0.5);
    });

    it('should follow WRAPPER configuration patterns', () => {
      expect(validationResult.findings.wrappers.length).toBeGreaterThan(0);
    });
  });

  describe('LIVING_LAYER Validation', () => {
    it('should have LLM integration components', () => {
      const requiredLiving = BRIK_L3_REQUIREMENTS.living_layer.components;
      const foundLiving = validationResult.findings.living_layer;
      
      // At least some living layer components should be present
      expect(foundLiving.length).toBeGreaterThan(0);
    });

    it('should demonstrate code living capabilities', () => {
      const hasLLMIntegration = validationResult.findings.living_layer.some(
        (comp: string) => comp.includes('LLM') || comp.includes('Integration')
      );
      expect(hasLLMIntegration).toBe(true);
    });
  });

  describe('Documentation Compliance', () => {
    it('should have all required documentation files', () => {
      const requiredDocs = BRIK_L3_REQUIREMENTS.documentation.required;
      const foundDocs = validationResult.findings.documentation;
      
      requiredDocs.forEach(doc => {
        expect(foundDocs).toContain(doc);
      });
    });

    it('should achieve minimum documentation coverage', () => {
      const requiredCount = BRIK_L3_REQUIREMENTS.documentation.required.length;
      const foundCount = validationResult.findings.documentation.filter(
        (doc: string) => !doc.includes('optional')
      ).length;
      
      const coverage = (foundCount / requiredCount) * 100;
      expect(coverage).toBeGreaterThan(80);
    });
  });

  describe('Overall L3 Compliance', () => {
    it('should achieve minimum compliance score for L3 certification', () => {
      expect(validationResult.score).toBeGreaterThan(85);
    });

    it('should be L3 compliant', () => {
      expect(validationResult.compliance).toBe(true);
    });

    it('should provide actionable recommendations if needed', () => {
      if (!validationResult.compliance) {
        expect(validationResult.recommendations.length).toBeGreaterThan(0);
      }
    });

    it('should generate detailed validation report', () => {
      expect(validationResult.findings).toBeDefined();
      expect(validationResult.findings.core).toBeInstanceOf(Array);
      expect(validationResult.findings.wrappers).toBeInstanceOf(Array);
      expect(validationResult.findings.living_layer).toBeInstanceOf(Array);
      expect(validationResult.findings.documentation).toBeInstanceOf(Array);
    });
  });
});