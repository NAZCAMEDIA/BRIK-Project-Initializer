/**
 * BRIK L3 Certification - Hash Generator for BRIK Projects
 * 
 * Generates reproducible cryptographic hashes for BRIK projects to ensure:
 * - Project integrity verification
 * - L3 certification validation
 * - Immutable project fingerprinting
 * - Cross-platform reproducibility
 * 
 * DEPLOYMENT: Move to scripts/generate_brik_hash.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

class BrikHashGenerator {
  constructor(projectRoot, options = {}) {
    this.projectRoot = path.resolve(projectRoot);
    this.options = {
      algorithm: 'sha256',
      includeMetadata: true,
      includeTimestamps: false,
      includeDependencies: true,
      encoding: 'hex',
      ...options
    };
    
    // Files and directories to exclude from hashing
    this.excludePatterns = [
      /^\.git$/,
      /^\.conductor$/,
      /^node_modules$/,
      /^target$/,
      /^dist$/,
      /^build$/,
      /^__pycache__$/,
      /^\.pytest_cache$/,
      /^\.coverage$/,
      /^coverage$/,
      /^logs?$/,
      /^tmp$/,
      /^temp$/,
      /\.log$/,
      /\.tmp$/,
      /\.cache$/,
      /\.DS_Store$/,
      /Thumbs\.db$/,
      /desktop\.ini$/,
      /\.env$/,
      /\.env\.local$/,
      /\.env\.production$/,
      /\.env\.development$/,
      /^\.brik-cert\.sha256$/  // Exclude existing hash file
    ];

    this.includePatterns = [
      /\.(js|ts|jsx|tsx|py|rs|go|java|cpp|c|h|hpp)$/,
      /\.(json|yaml|yml|toml|xml|md|txt)$/,
      /^(README|LICENSE|CHANGELOG|CONTRIBUTING|CODE_OF_CONDUCT|SECURITY)(\.(md|txt))?$/i,
      /^(package\.json|tsconfig\.json|pyproject\.toml|Cargo\.toml|go\.mod|pom\.xml)$/,
      /^(Dockerfile|docker-compose\.(yml|yaml))$/,
      /\.(sh|bash|zsh|ps1|bat|cmd)$/
    ];
  }

  /**
   * Generates a complete BRIK hash including all relevant project components
   */
  async generateBrikHash() {
    console.log('🔨 Generating BRIK L3 certification hash...');
    
    try {
      const components = await this.collectHashComponents();
      const hash = this.computeFinalHash(components);
      const hashData = this.createHashData(hash, components);
      
      await this.saveHashFile(hashData);
      
      console.log('✅ BRIK hash generated successfully');
      return hashData;
      
    } catch (error) {
      console.error('❌ Failed to generate BRIK hash:', error.message);
      throw error;
    }
  }

  /**
   * Collects all components that contribute to the BRIK hash
   */
  async collectHashComponents() {
    console.log('📋 Collecting hash components...');
    
    const components = {
      metadata: await this.collectMetadata(),
      sourceFiles: await this.collectSourceFiles(),
      configuration: await this.collectConfiguration(),
      dependencies: this.options.includeDependencies ? await this.collectDependencies() : null,
      structure: await this.collectProjectStructure(),
      documentation: await this.collectDocumentation()
    };
    
    return components;
  }

  /**
   * Collects project metadata for hashing
   */
  async collectMetadata() {
    const metadata = {
      generator: 'brik-l3-hash-generator',
      version: '1.0.0',
      timestamp: this.options.includeTimestamps ? new Date().toISOString() : null,
      projectRoot: path.basename(this.projectRoot),
      algorithm: this.options.algorithm
    };

    // Try to read existing BRIK certification
    const brikCertPath = path.join(this.projectRoot, '.brik-cert.json');
    if (await this.fileExists(brikCertPath)) {
      try {
        const brikCert = JSON.parse(await readFile(brikCertPath, 'utf8'));
        metadata.brikCertification = {
          project_name: brikCert.project_name,
          version: brikCert.version,
          certification_level: brikCert.certification_level,
          architecture: brikCert.architecture
        };
      } catch (error) {
        console.warn('Warning: Could not parse .brik-cert.json');
      }
    }

    return metadata;
  }

  /**
   * Collects and hashes all source files
   */
  async collectSourceFiles() {
    console.log('  - Collecting source files...');
    
    const sourceFiles = {};
    const files = await this.getAllProjectFiles();
    
    for (const file of files) {
      if (this.shouldIncludeFile(file)) {
        const relativePath = path.relative(this.projectRoot, file);
        const content = await readFile(file, 'utf8');
        
        // Hash individual file
        const fileHash = crypto.createHash(this.options.algorithm)
          .update(content)
          .digest(this.options.encoding);
        
        sourceFiles[relativePath] = {
          hash: fileHash,
          size: content.length,
          lines: content.split('\n').length
        };
      }
    }
    
    console.log(`    ✓ Processed ${Object.keys(sourceFiles).length} source files`);
    return sourceFiles;
  }

  /**
   * Collects configuration files for hashing
   */
  async collectConfiguration() {
    console.log('  - Collecting configuration...');
    
    const configurations = {};
    
    const configFiles = [
      'package.json',
      'tsconfig.json', 
      'pyproject.toml',
      'Cargo.toml',
      'go.mod',
      'pom.xml',
      'Dockerfile',
      'docker-compose.yml',
      'docker-compose.yaml',
      '.gitignore',
      '.npmrc',
      '.brik-cert.json'
    ];

    for (const configFile of configFiles) {
      const configPath = path.join(this.projectRoot, configFile);
      if (await this.fileExists(configPath)) {
        const content = await readFile(configPath, 'utf8');
        configurations[configFile] = {
          hash: crypto.createHash(this.options.algorithm)
            .update(content)
            .digest(this.options.encoding),
          size: content.length
        };
      }
    }
    
    console.log(`    ✓ Processed ${Object.keys(configurations).length} configuration files`);
    return configurations;
  }

  /**
   * Collects dependency information for hashing
   */
  async collectDependencies() {
    console.log('  - Collecting dependencies...');
    
    const dependencies = {};
    
    // Node.js dependencies
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (await this.fileExists(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
        dependencies.nodejs = {
          dependencies: packageJson.dependencies || {},
          devDependencies: packageJson.devDependencies || {},
          peerDependencies: packageJson.peerDependencies || {},
          optionalDependencies: packageJson.optionalDependencies || {}
        };
      } catch (error) {
        console.warn('Warning: Could not parse package.json');
      }
    }

    // Python dependencies
    const requirementsPath = path.join(this.projectRoot, 'requirements.txt');
    if (await this.fileExists(requirementsPath)) {
      const requirements = await readFile(requirementsPath, 'utf8');
      dependencies.python = {
        requirements: requirements.split('\n').filter(line => line.trim() && !line.startsWith('#'))
      };
    }

    const pyprojectPath = path.join(this.projectRoot, 'pyproject.toml');
    if (await this.fileExists(pyprojectPath)) {
      dependencies.python = dependencies.python || {};
      dependencies.python.pyprojectExists = true;
    }

    // Rust dependencies
    const cargoTomlPath = path.join(this.projectRoot, 'Cargo.toml');
    if (await this.fileExists(cargoTomlPath)) {
      dependencies.rust = { cargoTomlExists: true };
    }

    console.log(`    ✓ Collected dependencies for ${Object.keys(dependencies).length} ecosystems`);
    return dependencies;
  }

  /**
   * Collects project structure information
   */
  async collectProjectStructure() {
    console.log('  - Analyzing project structure...');
    
    const structure = {
      directories: [],
      fileTypes: {},
      totalFiles: 0,
      totalSize: 0
    };

    const files = await this.getAllProjectFiles();
    
    for (const file of files) {
      if (this.shouldIncludeFile(file)) {
        const relativePath = path.relative(this.projectRoot, file);
        const dir = path.dirname(relativePath);
        const ext = path.extname(file).toLowerCase();
        const stats = await stat(file);
        
        // Track directories
        if (dir !== '.' && !structure.directories.includes(dir)) {
          structure.directories.push(dir);
        }
        
        // Track file types
        structure.fileTypes[ext] = (structure.fileTypes[ext] || 0) + 1;
        structure.totalFiles++;
        structure.totalSize += stats.size;
      }
    }
    
    // Sort for reproducibility
    structure.directories.sort();
    
    console.log(`    ✓ Analyzed structure: ${structure.totalFiles} files, ${structure.directories.length} directories`);
    return structure;
  }

  /**
   * Collects documentation files
   */
  async collectDocumentation() {
    console.log('  - Collecting documentation...');
    
    const documentation = {};
    
    const docFiles = [
      'README.md',
      'README.txt', 
      'README',
      'LICENSE',
      'LICENSE.md',
      'LICENSE.txt',
      'CHANGELOG.md',
      'CONTRIBUTING.md',
      'CODE_OF_CONDUCT.md',
      'SECURITY.md'
    ];

    for (const docFile of docFiles) {
      const docPath = path.join(this.projectRoot, docFile);
      if (await this.fileExists(docPath)) {
        const content = await readFile(docPath, 'utf8');
        documentation[docFile] = {
          hash: crypto.createHash(this.options.algorithm)
            .update(content)
            .digest(this.options.encoding),
          wordCount: content.split(/\s+/).length,
          lineCount: content.split('\n').length
        };
      }
    }
    
    console.log(`    ✓ Processed ${Object.keys(documentation).length} documentation files`);
    return documentation;
  }

  /**
   * Computes the final BRIK hash from all components
   */
  computeFinalHash(components) {
    console.log('🔐 Computing final BRIK hash...');
    
    // Create a deterministic string representation of all components
    const hashInput = this.createDeterministicInput(components);
    
    // Generate the final hash
    const finalHash = crypto.createHash(this.options.algorithm)
      .update(hashInput)
      .digest(this.options.encoding);
    
    console.log(`    ✓ Generated ${this.options.algorithm.toUpperCase()} hash: ${finalHash.substring(0, 16)}...`);
    return finalHash;
  }

  /**
   * Creates a deterministic string input for hashing
   */
  createDeterministicInput(components) {
    // Sort all keys to ensure deterministic ordering
    const sortedComponents = this.sortObject(components);
    
    // Convert to JSON with deterministic ordering
    return JSON.stringify(sortedComponents, null, 0);
  }

  /**
   * Recursively sorts object keys for deterministic output
   */
  sortObject(obj) {
    if (obj === null || typeof obj !== 'object' || obj instanceof Date) {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.sortObject(item)).sort();
    }
    
    const sorted = {};
    Object.keys(obj).sort().forEach(key => {
      sorted[key] = this.sortObject(obj[key]);
    });
    
    return sorted;
  }

  /**
   * Creates the final hash data object
   */
  createHashData(hash, components) {
    const hashData = {
      brik_hash: hash,
      algorithm: this.options.algorithm,
      generated_at: new Date().toISOString(),
      generator_version: '1.0.0',
      project_root: path.basename(this.projectRoot),
      components: {
        source_files_count: Object.keys(components.sourceFiles).length,
        configuration_files_count: Object.keys(components.configuration).length,
        documentation_files_count: Object.keys(components.documentation).length,
        total_project_size: components.structure.totalSize,
        total_files_included: components.structure.totalFiles
      },
      verification: {
        reproducible: !this.options.includeTimestamps,
        cross_platform: true,
        algorithm_secure: ['sha256', 'sha3-256', 'sha512'].includes(this.options.algorithm)
      }
    };

    // Add metadata if available
    if (components.metadata.brikCertification) {
      hashData.brik_certification = components.metadata.brikCertification;
    }

    return hashData;
  }

  /**
   * Saves the hash to a file
   */
  async saveHashFile(hashData) {
    const hashFilePath = path.join(this.projectRoot, '.brik-cert.sha256');
    
    // Create human-readable hash file
    const hashFileContent = [
      `# BRIK L3 Certification Hash`,
      `# Generated: ${hashData.generated_at}`,
      `# Algorithm: ${hashData.algorithm.toUpperCase()}`,
      `# Project: ${hashData.project_root}`,
      `#`,
      `# This hash ensures project integrity and L3 compliance`,
      `# Verification: node scripts/generate_brik_hash.js --verify`,
      ``,
      hashData.brik_hash
    ].join('\n');

    await fs.promises.writeFile(hashFilePath, hashFileContent, 'utf8');
    
    // Also save detailed JSON report
    const reportPath = path.join(this.projectRoot, '.brik-hash-report.json');
    await fs.promises.writeFile(reportPath, JSON.stringify(hashData, null, 2), 'utf8');
    
    console.log(`    ✓ Hash saved to: ${path.relative(process.cwd(), hashFilePath)}`);
    console.log(`    ✓ Report saved to: ${path.relative(process.cwd(), reportPath)}`);
  }

  /**
   * Verifies an existing BRIK hash
   */
  async verifyBrikHash() {
    console.log('🔍 Verifying existing BRIK hash...');
    
    const hashFilePath = path.join(this.projectRoot, '.brik-cert.sha256');
    
    if (!await this.fileExists(hashFilePath)) {
      throw new Error('No BRIK hash file found (.brik-cert.sha256)');
    }
    
    // Read existing hash
    const hashFileContent = await readFile(hashFilePath, 'utf8');
    const existingHash = hashFileContent.split('\n').pop().trim();
    
    // Generate current hash
    const components = await this.collectHashComponents();
    const currentHash = this.computeFinalHash(components);
    
    const isValid = existingHash === currentHash;
    
    console.log(`    ✓ Existing hash: ${existingHash.substring(0, 16)}...`);
    console.log(`    ✓ Current hash:  ${currentHash.substring(0, 16)}...`);
    console.log(`    ${isValid ? '✅ VALID' : '❌ INVALID'}: Hash verification ${isValid ? 'passed' : 'failed'}`);
    
    return {
      valid: isValid,
      existingHash,
      currentHash,
      projectIntact: isValid
    };
  }

  /**
   * Helper methods
   */
  async getAllProjectFiles() {
    const files = [];
    
    const walkDir = async (dir) => {
      try {
        const items = await readdir(dir);
        
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stats = await stat(fullPath);
          
          if (stats.isDirectory()) {
            if (!this.shouldExcludeDirectory(item)) {
              await walkDir(fullPath);
            }
          } else if (stats.isFile()) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    };
    
    await walkDir(this.projectRoot);
    return files;
  }

  shouldExcludeDirectory(dirname) {
    return this.excludePatterns.some(pattern => pattern.test(dirname));
  }

  shouldIncludeFile(filePath) {
    const basename = path.basename(filePath);
    const relativePath = path.relative(this.projectRoot, filePath);
    
    // Check exclude patterns first
    if (this.excludePatterns.some(pattern => pattern.test(basename) || pattern.test(relativePath))) {
      return false;
    }
    
    // Check include patterns
    return this.includePatterns.some(pattern => pattern.test(basename) || pattern.test(relativePath));
  }

  async fileExists(filePath) {
    try {
      await stat(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * CLI Interface
 */
async function main() {
  const args = process.argv.slice(2);
  const projectRoot = args.find(arg => !arg.startsWith('--')) || process.cwd();
  
  const options = {
    algorithm: 'sha256',
    includeTimestamps: args.includes('--include-timestamps'),
    includeDependencies: !args.includes('--no-dependencies'),
    encoding: 'hex'
  };

  const generator = new BrikHashGenerator(projectRoot, options);

  try {
    if (args.includes('--verify')) {
      const result = await generator.verifyBrikHash();
      process.exit(result.valid ? 0 : 1);
    } else {
      const hashData = await generator.generateBrikHash();
      
      if (args.includes('--json')) {
        console.log(JSON.stringify(hashData, null, 2));
      }
      
      console.log('\n🎯 BRIK L3 Hash Generation Complete!');
      console.log(`Hash: ${hashData.brik_hash}`);
      console.log(`Files processed: ${hashData.components.total_files_included}`);
      console.log(`Project integrity: ${hashData.verification.reproducible ? 'Reproducible' : 'Time-dependent'}`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Export for use as module
module.exports = BrikHashGenerator;

// Run CLI if called directly
if (require.main === module) {
  main();
}