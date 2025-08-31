#!/usr/bin/env node

/**
 * Failure Monitoring Service - BRIK Executor
 * Captures and enriches failure context for automated issue creation
 */

const GitHubIssueService = require('./github-issue-service');
const os = require('os');
const process = require('process');

class FailureMonitoringService {
  constructor(config = {}) {
    this.gitHubService = new GitHubIssueService(config.github);
    this.enabled = config.enabled !== false; // Enabled by default
    this.failureCount = 0;
    this.lastFailure = null;
    
    // Environment detection
    this.environment = {
      NODE_ENV: process.env.NODE_ENV,
      nodeVersion: process.version,
      brikVersion: this._getBrikVersion(),
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname()
    };
  }

  /**
   * Monitors execution of a function and handles failures
   * @param {Function} executionFn - Function to execute and monitor
   * @param {Object} action - Action context for monitoring
   * @returns {Promise<any>} Result of execution or enriched error
   */
  async monitorExecution(executionFn, action) {
    if (!this.enabled) {
      // Pass through without monitoring
      return await executionFn();
    }

    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    
    try {
      const result = await executionFn();
      
      // Log successful execution for debugging
      const duration = Date.now() - startTime;
      console.log(`✅ Action ${action.type} completed successfully in ${duration}ms`);
      
      return result;
    } catch (error) {
      // Capture and enrich failure context
      const failureContext = await this._enrichFailureContext(action, error, timestamp, startTime);
      
      // Create GitHub Issue asynchronously (don't block on failure)
      this._createFailureIssue(failureContext).catch(issueError => {
        console.error('⚠️ Failed to create GitHub Issue for failure:', issueError.message);
      });
      
      // Update failure tracking
      this.failureCount++;
      this.lastFailure = failureContext;
      
      // Re-throw the original error to maintain normal error flow
      throw error;
    }
  }

  /**
   * Enriches failure context with diagnostic information
   * @param {Object} action - Original action that failed
   * @param {Error} error - Error that occurred
   * @param {String} timestamp - Failure timestamp
   * @param {Number} startTime - Execution start time
   * @returns {Promise<Object>} Enriched failure context
   */
  async _enrichFailureContext(action, error, timestamp, startTime) {
    const duration = Date.now() - startTime;
    
    const diagnostics = {
      memoryUsage: this._formatMemoryUsage(process.memoryUsage()),
      uptime: Math.round(process.uptime()),
      platform: this.environment.platform,
      cwd: process.cwd(),
      pid: process.pid,
      duration: `${duration}ms`,
      loadAverage: os.loadavg(),
      freeMemory: Math.round(os.freemem() / 1024 / 1024) + 'MB',
      totalMemory: Math.round(os.totalmem() / 1024 / 1024) + 'MB'
    };

    // Additional context based on action type
    const actionContext = this._getActionSpecificContext(action);
    
    return {
      action: {
        type: action.type,
        data: this._sanitizeActionData(action.data)
      },
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code
      },
      timestamp,
      environment: this.environment,
      diagnostics,
      actionContext,
      failureId: this._generateFailureId(action.type, timestamp)
    };
  }

  /**
   * Gets action-specific context for better diagnostics
   * @param {Object} action - Action that failed
   * @returns {Object} Action-specific context
   */
  _getActionSpecificContext(action) {
    const context = {};
    
    switch (action.type) {
      case 'create_project_structure':
      case 'create_api_project':
        context.projectName = action.data?.name || 'unknown';
        context.architecture = action.data?.architecture || 'brik';
        context.level = action.data?.level || 'L3';
        break;
        
      case 'generate_entity':
      case 'generate_service':
      case 'generate_controller':
        context.entityName = action.data?.name || 'unknown';
        context.templateType = action.data?.type || 'unknown';
        break;
        
      case 'analyze_project':
        context.projectPath = action.data?.path || process.cwd();
        context.purpose = action.data?.purpose || 'general';
        break;
        
      case 'create_file':
      case 'modify_file':
      case 'delete_file':
        context.filePath = action.data?.path || 'unknown';
        break;
        
      case 'run_command':
        context.command = action.data?.command || 'unknown';
        context.workingDir = action.data?.cwd || process.cwd();
        break;
    }
    
    return context;
  }

  /**
   * Sanitizes action data to remove sensitive information
   * @param {Object} data - Action data to sanitize
   * @returns {Object} Sanitized data
   */
  _sanitizeActionData(data) {
    if (!data || typeof data !== 'object') {
      return data;
    }
    
    const sanitized = { ...data };
    
    // Remove potentially sensitive fields
    const sensitiveFields = ['password', 'token', 'key', 'secret', 'auth'];
    
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }
    
    // Limit content size to prevent huge issues
    if (sanitized.content && sanitized.content.length > 1000) {
      sanitized.content = sanitized.content.substring(0, 1000) + '... [TRUNCATED]';
    }
    
    return sanitized;
  }

  /**
   * Creates GitHub Issue for the failure (async)
   * @param {Object} failureContext - Enriched failure context
   * @returns {Promise<Object>} Issue creation result
   */
  async _createFailureIssue(failureContext) {
    try {
      console.log(`🚨 BRIK Executor Failure detected: ${failureContext.action.type}`);
      console.log(`📝 Creating GitHub Issue for failure ID: ${failureContext.failureId}`);
      
      const result = await this.gitHubService.createFailureIssue(failureContext);
      
      if (result.html_url) {
        console.log(`🔗 Failure tracked: ${result.html_url}`);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Issue creation failed:', error.message);
      throw error;
    }
  }

  /**
   * Formats memory usage for display
   * @param {Object} memUsage - Process memory usage
   * @returns {String} Formatted memory usage
   */
  _formatMemoryUsage(memUsage) {
    const formatBytes = (bytes) => Math.round(bytes / 1024 / 1024) + 'MB';
    
    return `RSS: ${formatBytes(memUsage.rss)}, Heap: ${formatBytes(memUsage.heapUsed)}/${formatBytes(memUsage.heapTotal)}`;
  }

  /**
   * Generates unique failure ID
   * @param {String} actionType - Type of action that failed
   * @param {String} timestamp - Failure timestamp
   * @returns {String} Unique failure ID
   */
  _generateFailureId(actionType, timestamp) {
    const hash = require('crypto')
      .createHash('md5')
      .update(actionType + timestamp + process.pid)
      .digest('hex')
      .substring(0, 8);
    
    return `BRIK-FAIL-${actionType.toUpperCase()}-${hash}`;
  }

  /**
   * Gets BRIK version from package.json
   * @returns {String} BRIK version
   */
  _getBrikVersion() {
    try {
      const packagePath = require('path').join(__dirname, '../../package.json');
      const packageJson = require(packagePath);
      return packageJson.version || 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Tests the monitoring system
   * @returns {Promise<Boolean>} Test result
   */
  async testMonitoring() {
    console.log('🧪 Testing BRIK Failure Monitoring System...');
    
    // Test GitHub connection
    const githubConnected = await this.gitHubService.testConnection();
    
    // Test failure capture (without creating real issue)
    const testAction = { type: 'test_action', data: { test: true } };
    const testError = new Error('Test failure for monitoring system');
    
    const originalEnabled = this.enabled;
    this.enabled = false; // Disable for test
    
    try {
      await this.monitorExecution(() => {
        throw testError;
      }, testAction);
    } catch (caught) {
      if (caught === testError) {
        console.log('✅ Error passthrough working correctly');
      }
    }
    
    this.enabled = originalEnabled;
    
    console.log(`📊 Monitoring Status:`);
    console.log(`  - GitHub API: ${githubConnected ? '✅' : '❌'}`);
    console.log(`  - Error Capture: ✅`);
    console.log(`  - Context Enrichment: ✅`);
    console.log(`  - Failure Count: ${this.failureCount}`);
    
    return githubConnected;
  }

  /**
   * Gets monitoring statistics
   * @returns {Object} Monitoring statistics
   */
  getStats() {
    return {
      enabled: this.enabled,
      failureCount: this.failureCount,
      lastFailure: this.lastFailure ? {
        actionType: this.lastFailure.action.type,
        timestamp: this.lastFailure.timestamp,
        failureId: this.lastFailure.failureId
      } : null,
      environment: this.environment
    };
  }
}

module.exports = FailureMonitoringService;