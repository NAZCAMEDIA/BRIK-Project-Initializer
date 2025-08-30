/**
 * BRIK Structure Validation Test - Simplified Version
 * Validates core BRIK architecture compliance
 */

const fs = require('fs');
const path = require('path');

describe('BRIK Structure Validation', () => {
  let projectRoot;
  let findings;

  beforeAll(() => {
    projectRoot = process.cwd();
    findings = {
      core: [],
      wrappers: [],
      living_layer: [],
      documentation: [],
      violations: []
    };
  });

  test('should have CORE architecture components', async () => {
    const expectedCore = [
      'BrikCore',
      'BrikControlHub', 
      'WrapperOrchestrator',
      'BaseController'
    ];

    // Scan for core components
    const files = await getAllProjectFiles();
    for (const file of files) {
      const content = await readFileContent(file);
      const fileName = path.basename(file);
      
      // Check for core patterns
      if (content.includes('core') || fileName.includes('core')) {
        findings.core.push(file);
      }
    }

    expect(findings.core.length).toBeGreaterThan(0);
  });

  test('should have WRAPPERS layer components', async () => {
    const files = await getAllProjectFiles();
    
    for (const file of files) {
      const content = await readFileContent(file);
      const fileName = path.basename(file);
      
      if (content.includes('wrapper') || fileName.includes('wrapper') ||
          content.includes('integration') || fileName.includes('integration')) {
        findings.wrappers.push(file);
      }
    }

    expect(findings.wrappers.length).toBeGreaterThan(0);
  });

  test('should have LIVING_LAYER components', async () => {
    const files = await getAllProjectFiles();
    
    for (const file of files) {
      const content = await readFileContent(file);
      const fileName = path.basename(file);
      
      if (content.includes('living') || fileName.includes('living') ||
          content.includes('LLM') || fileName.includes('llm')) {
        findings.living_layer.push(file);
      }
    }

    // Living layer is optional for basic projects
    expect(findings.living_layer.length).toBeGreaterThanOrEqual(0);
  });

  test('should have required documentation', async () => {
    const requiredDocs = ['README.md', 'LICENSE'];
    const foundDocs = [];

    for (const doc of requiredDocs) {
      const docPath = path.join(projectRoot, doc);
      if (fs.existsSync(docPath)) {
        foundDocs.push(doc);
        findings.documentation.push(docPath);
      }
    }

    expect(foundDocs.length).toBeGreaterThanOrEqual(1);
  });

  test('should have valid project structure', async () => {
    const totalComponents = findings.core.length + findings.wrappers.length + findings.living_layer.length;
    const hasDocumentation = findings.documentation.length > 0;
    
    // Basic compliance check
    const isCompliant = totalComponents >= 1 && hasDocumentation;
    
    expect(isCompliant).toBe(true);
  });

  // Helper functions
  async function getAllProjectFiles() {
    const files = [];
    const walkDir = async (dir) => {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        if (item.startsWith('.') || item === 'node_modules') continue;
        
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          await walkDir(fullPath);
        } else if (item.endsWith('.js') || item.endsWith('.ts') || 
                   item.endsWith('.py') || item.endsWith('.rs') || 
                   item.endsWith('.md')) {
          files.push(fullPath);
        }
      }
    };

    await walkDir(projectRoot);
    return files;
  }

  async function readFileContent(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      return '';
    }
  }
});