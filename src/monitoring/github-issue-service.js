#!/usr/bin/env node

/**
 * GitHub Issue Service - BRIK Failure Monitoring
 * Handles automatic GitHub Issue creation for executor failures
 */

const https = require('https');
const { promisify } = require('util');

class GitHubIssueService {
  constructor(config = {}) {
    this.token = config.token || process.env.GITHUB_TOKEN;
    this.owner = config.owner || process.env.GITHUB_OWNER || 'NAZCAMEDIA';
    this.repo = config.repo || process.env.GITHUB_REPO || 'BRIK-Project-Initializer';
    this.baseUrl = 'api.github.com';
    
    if (!this.token) {
      console.warn('⚠️ GitHub token not provided - Issues will be logged but not created');
    }
  }

  /**
   * Creates a GitHub Issue for a BRIK Executor failure
   * @param {Object} failureContext - Enriched failure context
   * @returns {Promise<Object>} Issue creation result
   */
  async createFailureIssue(failureContext) {
    try {
      if (!this.token) {
        return this._logIssueLocally(failureContext);
      }

      const issueData = this._buildIssueData(failureContext);
      const result = await this._makeGitHubRequest('POST', `/repos/${this.owner}/${this.repo}/issues`, issueData);
      
      console.log(`✅ GitHub Issue created: #${result.number} - ${result.html_url}`);
      return result;
    } catch (error) {
      console.error('❌ Failed to create GitHub Issue:', error.message);
      // Fallback to local logging
      return this._logIssueLocally(failureContext);
    }
  }

  /**
   * Builds structured issue data for GitHub API
   * @param {Object} failureContext - Failure context
   * @returns {Object} GitHub issue data
   */
  _buildIssueData(failureContext) {
    const { action, error, timestamp, environment, diagnostics } = failureContext;
    
    const title = `🚨 BRIK Executor Failure: ${action.type}`;
    
    const body = this._buildIssueBody(failureContext);
    
    const labels = this._determineLabels(failureContext);
    
    return {
      title,
      body,
      labels
    };
  }

  /**
   * Builds comprehensive issue body with diagnostic information
   * @param {Object} failureContext - Failure context
   * @returns {String} Formatted issue body
   */
  _buildIssueBody(failureContext) {
    const { action, error, timestamp, environment, diagnostics } = failureContext;
    
    return `## 🚨 BRIK Executor Failure Report

### Failure Summary
- **Action Type**: \`${action.type}\`
- **Timestamp**: ${timestamp}
- **Environment**: ${environment.NODE_ENV || 'unknown'}
- **Node Version**: ${environment.nodeVersion}
- **BRIK Version**: ${environment.brikVersion}

### Error Details
\`\`\`
${error.message}
\`\`\`

### Stack Trace
\`\`\`
${error.stack}
\`\`\`

### Action Data
\`\`\`json
${JSON.stringify(action.data, null, 2)}
\`\`\`

### Diagnostics
- **Memory Usage**: ${diagnostics.memoryUsage}
- **Uptime**: ${diagnostics.uptime}s
- **Platform**: ${diagnostics.platform}
- **Working Directory**: ${diagnostics.cwd}

### Automatic Labels Applied
${this._determineLabels(failureContext).map(label => `- \`${label}\``).join('\n')}

---

*This issue was automatically created by BRIK Failure Monitoring System*
*For immediate attention, check the \`P1-critical\` or \`P2-high\` labels*

### AI Agent Context
This failure occurred during BRIK project execution and may require:
- Code generation review
- Template validation
- Dependency analysis  
- Architecture compliance check

**Suggested Next Actions for AI Agents:**
1. Analyze error pattern for similar failures
2. Review action handler implementation: \`${action.type}\`
3. Validate input data structure and constraints
4. Check for environment-specific issues
`;
  }

  /**
   * Determines appropriate GitHub labels based on failure context
   * @param {Object} failureContext - Failure context
   * @returns {Array<String>} Array of label names
   */
  _determineLabels(failureContext) {
    const { action, error } = failureContext;
    const labels = ['type:bug', 'status:needs-review'];
    
    // Priority based on action type criticality
    const criticalActions = [
      'create_project_structure', 
      'create_api_project', 
      'generate_entity', 
      'run_certification'
    ];
    
    const highActions = [
      'generate_service', 
      'generate_controller', 
      'analyze_project',
      'generate_tests'
    ];
    
    if (criticalActions.includes(action.type)) {
      labels.push('P1-critical');
    } else if (highActions.includes(action.type)) {
      labels.push('P2-high');
    } else {
      labels.push('P3-medium');
    }
    
    // Gate level based on action type
    if (action.type.includes('create') || action.type.includes('structure')) {
      labels.push('L0-foundation');
    } else if (action.type.includes('generate') || action.type.includes('service')) {
      labels.push('L1-core');
    } else if (action.type.includes('analyze') || action.type.includes('certification')) {
      labels.push('L2-intelligent');
    }
    
    // Error type specific labels
    if (error.name === 'ValidationError') {
      labels.push('type:validation');
    } else if (error.message.includes('permission') || error.message.includes('EACCES')) {
      labels.push('type:permissions');
    } else if (error.message.includes('ENOENT') || error.message.includes('not found')) {
      labels.push('type:missing-resource');
    }
    
    // Add AI/automation friendly labels
    labels.push('automation:brik-executor', 'needs:ai-analysis');
    
    return labels;
  }

  /**
   * Makes authenticated request to GitHub API
   * @param {String} method - HTTP method
   * @param {String} path - API path
   * @param {Object} data - Request data
   * @returns {Promise<Object>} API response
   */
  async _makeGitHubRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
      const postData = data ? JSON.stringify(data) : null;
      
      const options = {
        hostname: this.baseUrl,
        path: path,
        method: method,
        headers: {
          'User-Agent': 'BRIK-Executor-Monitoring/1.0',
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        }
      };
      
      if (postData) {
        options.headers['Content-Length'] = Buffer.byteLength(postData);
      }
      
      const req = https.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsed);
            } else {
              reject(new Error(`GitHub API Error ${res.statusCode}: ${parsed.message || responseData}`));
            }
          } catch (parseError) {
            reject(new Error(`Failed to parse GitHub API response: ${responseData}`));
          }
        });
      });
      
      req.on('error', (error) => {
        reject(new Error(`GitHub API Request failed: ${error.message}`));
      });
      
      if (postData) {
        req.write(postData);
      }
      
      req.end();
    });
  }

  /**
   * Logs issue locally when GitHub API is not available
   * @param {Object} failureContext - Failure context
   * @returns {Object} Local log result
   */
  _logIssueLocally(failureContext) {
    const { action, error, timestamp } = failureContext;
    
    const logEntry = {
      type: 'local_failure_log',
      timestamp,
      action: action.type,
      error: error.message,
      data: action.data,
      note: 'GitHub token not available - logged locally'
    };
    
    console.log('📝 BRIK Failure logged locally:', JSON.stringify(logEntry, null, 2));
    
    // TODO: Could write to a local failure log file here
    // await fs.appendFile('brik-failures.log', JSON.stringify(logEntry) + '\n');
    
    return logEntry;
  }

  /**
   * Test GitHub connectivity and permissions
   * @returns {Promise<Boolean>} Connection test result
   */
  async testConnection() {
    try {
      if (!this.token) {
        console.log('⚠️ No GitHub token - testing skipped');
        return false;
      }
      
      const result = await this._makeGitHubRequest('GET', `/repos/${this.owner}/${this.repo}`);
      console.log(`✅ GitHub API connection successful: ${result.full_name}`);
      return true;
    } catch (error) {
      console.error(`❌ GitHub API connection failed: ${error.message}`);
      return false;
    }
  }
}

module.exports = GitHubIssueService;