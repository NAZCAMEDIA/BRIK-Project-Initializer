#!/usr/bin/env node

/**
 * Test Suite for BRIK Failure Monitoring System
 * Validates GitHub Issue creation and failure context enrichment
 */

const BRIKExecutor = require('../src/execution/executor');
const FailureMonitoringService = require('../src/monitoring/failure-monitoring-service');
const GitHubIssueService = require('../src/monitoring/github-issue-service');

class FailureMonitoringTest {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      total: 0
    };
  }

  /**
   * Runs all tests for the failure monitoring system
   */
  async runAllTests() {
    console.log('🧪 Starting BRIK Failure Monitoring Tests');
    console.log('='.repeat(50));

    await this.testExecutorIntegration();
    await this.testFailureContextEnrichment();
    await this.testGitHubIssueService();
    await this.testActionHandlerFailure();
    await this.testMonitoringConfiguration();

    this.displayResults();
  }

  /**
   * Tests basic executor integration with monitoring
   */
  async testExecutorIntegration() {
    this.log('🔧 Testing BRIK Executor Integration...');
    
    try {
      const executor = new BRIKExecutor();
      
      // Test that monitoring is initialized
      this.assert(
        executor.failureMonitoring instanceof FailureMonitoringService,
        'Failure monitoring service should be initialized'
      );
      
      // Test monitoring stats
      const stats = executor.getMonitoringStats();
      this.assert(
        typeof stats === 'object' && 'enabled' in stats,
        'Monitoring stats should be available'
      );
      
      console.log('✅ Executor integration test passed');
    } catch (error) {
      this.fail('Executor integration', error);
    }
  }

  /**
   * Tests failure context enrichment
   */
  async testFailureContextEnrichment() {
    this.log('📊 Testing Failure Context Enrichment...');
    
    try {
      const monitoring = new FailureMonitoringService({ enabled: true });
      
      const testAction = {
        type: 'test_action',
        data: { name: 'test-project', purpose: 'testing' }
      };
      
      const testError = new Error('Test error for context enrichment');
      testError.code = 'TEST_ERROR';
      
      // Disable GitHub creation for this test
      monitoring.gitHubService = {
        createFailureIssue: async (context) => {
          // Validate enriched context structure
          this.assert(context.action, 'Context should have action');
          this.assert(context.error, 'Context should have error details');
          this.assert(context.timestamp, 'Context should have timestamp');
          this.assert(context.environment, 'Context should have environment info');
          this.assert(context.diagnostics, 'Context should have diagnostics');
          this.assert(context.failureId, 'Context should have failure ID');
          
          // Validate action context
          this.assert(context.action.type === 'test_action', 'Action type should be preserved');
          this.assert(context.action.data.name === 'test-project', 'Action data should be preserved');
          
          // Validate error context
          this.assert(context.error.message === 'Test error for context enrichment', 'Error message should be preserved');
          this.assert(context.error.code === 'TEST_ERROR', 'Error code should be preserved');
          
          return { type: 'test_result', success: true };
        }
      };
      
      try {
        await monitoring.monitorExecution(() => {
          throw testError;
        }, testAction);
      } catch (caught) {
        this.assert(caught === testError, 'Original error should be re-thrown');
      }
      
      console.log('✅ Failure context enrichment test passed');
    } catch (error) {
      this.fail('Context enrichment', error);
    }
  }

  /**
   * Tests GitHub Issue Service functionality
   */
  async testGitHubIssueService() {
    this.log('🐙 Testing GitHub Issue Service...');
    
    try {
      const gitHubService = new GitHubIssueService({
        token: null // Test without token (local mode)
      });
      
      const mockFailureContext = {
        action: { type: 'test_action', data: { test: true } },
        error: { name: 'TestError', message: 'Mock error', stack: 'Mock stack trace' },
        timestamp: new Date().toISOString(),
        environment: { NODE_ENV: 'test', nodeVersion: 'v18.0.0', brikVersion: '5.1.0' },
        diagnostics: { memoryUsage: '100MB', uptime: 60, platform: 'test' },
        failureId: 'TEST-FAILURE-123'
      };
      
      // Test issue data building
      const issueData = gitHubService._buildIssueData(mockFailureContext);
      
      this.assert(issueData.title.includes('test_action'), 'Issue title should include action type');
      this.assert(issueData.body.includes('Mock error'), 'Issue body should include error message');
      this.assert(Array.isArray(issueData.labels), 'Issue should have labels array');
      this.assert(issueData.labels.includes('type:bug'), 'Issue should have bug label');
      
      // Test label determination
      const labels = gitHubService._determineLabels(mockFailureContext);
      this.assert(labels.includes('automation:brik-executor'), 'Should have automation label');
      this.assert(labels.includes('needs:ai-analysis'), 'Should have AI analysis label');
      
      // Test local logging (when no GitHub token)
      const result = await gitHubService.createFailureIssue(mockFailureContext);
      this.assert(result.type === 'local_failure_log', 'Should log locally when no token');
      
      console.log('✅ GitHub Issue Service test passed');
    } catch (error) {
      this.fail('GitHub Issue Service', error);
    }
  }

  /**
   * Tests actual action handler failure capture
   */
  async testActionHandlerFailure() {
    this.log('⚙️ Testing Action Handler Failure Capture...');
    
    try {
      const executor = new BRIKExecutor();
      
      // Disable GitHub creation for test
      executor.failureMonitoring.gitHubService.createFailureIssue = async (context) => {
        console.log(`📝 Mock issue created for: ${context.action.type}`);
        return { type: 'mock_issue', number: 123 };
      };
      
      // Test with unrecognized action type
      try {
        await executor.execute({ type: 'unknown_action', data: {} });
        this.fail('Unknown action should throw error');
      } catch (error) {
        console.log('Caught error message:', error.message);
        this.assert(
          error.message.includes('Tipo de acción no reconocido') || error.message.includes('unrecognized action'),
          `Should throw proper error for unknown action. Got: ${error.message}`
        );
      }
      
      // Check that failure was tracked
      const stats = executor.getMonitoringStats();
      this.assert(stats.failureCount > 0, 'Failure count should increase');
      this.assert(stats.lastFailure, 'Last failure should be recorded');
      
      console.log('✅ Action handler failure capture test passed');
    } catch (error) {
      this.fail('Action handler failure', error);
    }
  }

  /**
   * Tests monitoring configuration options
   */
  async testMonitoringConfiguration() {
    this.log('⚙️ Testing Monitoring Configuration...');
    
    try {
      // Test disabled monitoring
      const disabledMonitoring = new FailureMonitoringService({ enabled: false });
      
      let errorThrown = false;
      try {
        await disabledMonitoring.monitorExecution(() => {
          throw new Error('Test error');
        }, { type: 'test', data: {} });
      } catch (error) {
        errorThrown = true;
      }
      
      this.assert(errorThrown, 'Error should still be thrown when monitoring disabled');
      this.assert(disabledMonitoring.failureCount === 0, 'Failure count should not increase when disabled');
      
      // Test custom GitHub configuration
      const customMonitoring = new FailureMonitoringService({
        github: {
          owner: 'custom-owner',
          repo: 'custom-repo'
        }
      });
      
      this.assert(
        customMonitoring.gitHubService.owner === 'custom-owner',
        'Custom GitHub owner should be set'
      );
      
      console.log('✅ Monitoring configuration test passed');
    } catch (error) {
      this.fail('Monitoring configuration', error);
    }
  }

  /**
   * Helper method to assert conditions
   */
  assert(condition, message) {
    this.testResults.total++;
    if (condition) {
      this.testResults.passed++;
    } else {
      this.testResults.failed++;
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  /**
   * Helper method to log test progress
   */
  log(message) {
    console.log(`\n${message}`);
  }

  /**
   * Helper method to handle test failures
   */
  fail(testName, error) {
    this.testResults.failed++;
    console.error(`❌ ${testName} test failed:`, error.message);
    throw error;
  }

  /**
   * Displays final test results
   */
  displayResults() {
    console.log('\n' + '='.repeat(50));
    console.log('🧪 BRIK Failure Monitoring Test Results');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${this.testResults.passed}`);
    console.log(`❌ Failed: ${this.testResults.failed}`);
    console.log(`📊 Total: ${this.testResults.total}`);
    
    if (this.testResults.failed === 0) {
      console.log('\n🎉 All tests passed! Failure monitoring system is working correctly.');
    } else {
      console.log('\n⚠️ Some tests failed. Please review the implementation.');
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new FailureMonitoringTest();
  tester.runAllTests().catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = FailureMonitoringTest;