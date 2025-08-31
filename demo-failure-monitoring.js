#!/usr/bin/env node

/**
 * BRIK Failure Monitoring Demo
 * Demonstrates automatic GitHub Issue creation for executor failures
 */

const BRIKExecutor = require('./src/execution/executor');

async function demonstrateFailureMonitoring() {
  console.log('🧬 BRIK Failure Monitoring System Demo');
  console.log('='.repeat(50));
  
  const executor = new BRIKExecutor();
  
  // Test monitoring system
  console.log('\n1. Testing monitoring system connectivity...');
  const monitoringWorking = await executor.testFailureMonitoring();
  
  // Show current stats
  console.log('\n2. Current monitoring statistics:');
  const stats = executor.getMonitoringStats();
  console.log(JSON.stringify(stats, null, 2));
  
  // Demonstrate successful action execution
  console.log('\n3. Demonstrating successful action execution...');
  try {
    const result = await executor.execute({
      type: 'create_project_structure',
      data: { name: 'demo-project-test', architecture: 'brik' }
    });
    console.log('✅ Action completed successfully');
  } catch (error) {
    console.log('⚠️ This action failed (expected for demo):', error.message);
  }
  
  // Demonstrate failure monitoring with invalid action
  console.log('\n4. Demonstrating failure monitoring with invalid action...');
  try {
    await executor.execute({
      type: 'invalid_action_demo',
      data: { 
        demo: true,
        description: 'This is a demo failure to show GitHub Issue creation'
      }
    });
  } catch (error) {
    console.log(`❌ Action failed as expected: ${error.message}`);
    console.log('📝 Failure was captured by monitoring system');
  }
  
  // Show updated stats
  console.log('\n5. Updated monitoring statistics after failure:');
  const updatedStats = executor.getMonitoringStats();
  console.log(JSON.stringify(updatedStats, null, 2));
  
  console.log('\n='.repeat(50));
  console.log('🎯 Demo completed!');
  console.log('\nKey features demonstrated:');
  console.log('✅ Automatic failure detection and enrichment');
  console.log('✅ GitHub Issue creation (or local logging when no token)');
  console.log('✅ Rich diagnostic context');
  console.log('✅ Appropriate labeling for AI/agent workflows');
  console.log('✅ Error passthrough for normal application flow');
  
  if (!process.env.GITHUB_TOKEN) {
    console.log('\n💡 To enable actual GitHub Issue creation:');
    console.log('   export GITHUB_TOKEN="your_github_token"');
    console.log('   export GITHUB_OWNER="your_username_or_org"');
    console.log('   export GITHUB_REPO="your_repository_name"');
  }
}

// Run demo if called directly
if (require.main === module) {
  demonstrateFailureMonitoring().catch(error => {
    console.error('❌ Demo failed:', error);
    process.exit(1);
  });
}

module.exports = { demonstrateFailureMonitoring };