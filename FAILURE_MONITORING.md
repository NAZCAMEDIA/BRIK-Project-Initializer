# BRIK Executor Failure Monitoring System

## Overview

The BRIK Project Initializer now includes an automatic failure monitoring system that captures executor failures and creates GitHub Issues with enriched diagnostic context. This enables immediate visibility into problems and supports downstream AI/agent workflows for automated issue resolution.

## Features

### 🚨 Automatic Failure Detection
- Monitors all BRIK Executor action executions
- Captures unhandled exceptions and errors
- Enriches failure context with diagnostic information
- Preserves normal error flow (re-throws original errors)

### 📋 GitHub Issue Creation
- Automatically creates GitHub Issues for failures
- Applies appropriate labels for AI/agent workflows
- Includes comprehensive diagnostic information
- Falls back to local logging when GitHub API unavailable

### 🏷️ Intelligent Labeling
Issues are automatically labeled based on:
- **Priority**: P1-critical, P2-high, P3-medium (based on action criticality)
- **Type**: type:bug, type:validation, type:permissions, type:missing-resource
- **Gate Level**: L0-foundation, L1-core, L2-intelligent (based on action type)
- **AI/Automation**: automation:brik-executor, needs:ai-analysis

### 📊 Rich Diagnostic Context
Each failure captures:
- Action type and input data
- Complete error details and stack trace
- Environment information (Node.js version, platform, etc.)
- System diagnostics (memory usage, uptime, etc.)
- Execution context (working directory, duration, etc.)

## Configuration

### Environment Variables

```bash
# GitHub API Configuration (optional - falls back to local logging)
export GITHUB_TOKEN="your_github_personal_access_token"
export GITHUB_OWNER="your_username_or_organization"  # Default: NAZCAMEDIA
export GITHUB_REPO="your_repository_name"            # Default: BRIK-Project-Initializer

# Monitoring Control
export BRIK_FAILURE_MONITORING="true"  # Default: true (set to "false" to disable)
```

### GitHub Token Setup

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Create a new token with `repo` scope (for issue creation)
3. Set the `GITHUB_TOKEN` environment variable

## Usage

### Automatic Monitoring

Failure monitoring is enabled by default for all BRIK Executor actions:

```javascript
const BRIKExecutor = require('./src/execution/executor');

const executor = new BRIKExecutor();

// This will be automatically monitored
try {
  await executor.execute({
    type: 'create_project_structure',
    data: { name: 'my-project' }
  });
} catch (error) {
  // Original error is preserved
  // GitHub Issue created automatically in background
  console.error('Action failed:', error.message);
}
```

### Monitoring Statistics

```javascript
// Get current monitoring statistics
const stats = executor.getMonitoringStats();
console.log(stats);
// {
//   enabled: true,
//   failureCount: 2,
//   lastFailure: {
//     actionType: 'create_api_project',
//     timestamp: '2024-01-01T12:00:00.000Z',
//     failureId: 'BRIK-FAIL-CREATE_API_PROJECT-abc123'
//   },
//   environment: { ... }
// }
```

### Testing the System

```javascript
// Test monitoring system connectivity
const isWorking = await executor.testFailureMonitoring();

// Simulate a failure for testing
await executor.simulateFailure('test_monitoring');
```

## Example GitHub Issue

When a failure occurs, an issue like this is automatically created:

```markdown
## 🚨 BRIK Executor Failure Report

### Failure Summary
- **Action Type**: `create_api_project`
- **Timestamp**: 2024-01-01T12:00:00.000Z
- **Environment**: production
- **Node Version**: v18.17.0
- **BRIK Version**: 5.1.0

### Error Details
```
ENOENT: no such file or directory, open '/path/to/template.js'
```

### Stack Trace
```
Error: ENOENT: no such file or directory...
    at createApiProject (/src/execution/executor.js:150:10)
    ...
```

### Action Data
```json
{
  "name": "my-api",
  "type": "rest",
  "framework": "express"
}
```

### Diagnostics
- **Memory Usage**: RSS: 45MB, Heap: 12MB/25MB
- **Uptime**: 125s
- **Platform**: linux
- **Working Directory**: /home/user/projects

### AI Agent Context
This failure occurred during BRIK project execution and may require:
- Code generation review
- Template validation
- Dependency analysis
- Architecture compliance check
```

**Labels Applied**: `type:bug`, `P2-high`, `L1-core`, `automation:brik-executor`, `needs:ai-analysis`

## Testing

Run the test suite:

```bash
# Test the failure monitoring system
node tests/failure-monitoring.test.js

# Demo the system
node demo-failure-monitoring.js
```

## Architecture

### Components

1. **GitHubIssueService** (`src/monitoring/github-issue-service.js`)
   - Handles GitHub API integration
   - Formats issue content and labels
   - Falls back to local logging

2. **FailureMonitoringService** (`src/monitoring/failure-monitoring-service.js`)
   - Wraps executor actions with monitoring
   - Enriches failure context
   - Manages failure statistics

3. **Enhanced BRIKExecutor** (`src/execution/executor.js`)
   - Integrates failure monitoring
   - Maintains backward compatibility
   - Provides monitoring utilities

### Design Principles

- **Non-intrusive**: Monitoring wraps existing functionality without changing core logic
- **Resilient**: Monitoring failures don't affect main application flow
- **Configurable**: Can be disabled or configured via environment variables
- **Comprehensive**: Captures rich context for effective issue resolution

## Integration with AI/Agent Workflows

The failure monitoring system is designed to support automated issue resolution:

### Label-based Automation
- `automation:brik-executor`: Identifies automated BRIK failures
- `needs:ai-analysis`: Flags issues requiring AI review
- Priority labels (`P1-P4`): Enable priority-based automation
- Gate labels (`L0-L3`): Enable architecture-level automation

### Structured Context
- JSON-formatted action data for programmatic analysis
- Standardized error categorization
- Environment and diagnostic data for context-aware resolution

### Example Automation Workflows
```yaml
# .github/workflows/ai-issue-analysis.yml
name: AI Issue Analysis
on:
  issues:
    types: [opened]

jobs:
  analyze:
    if: contains(github.event.issue.labels.*.name, 'automation:brik-executor')
    steps:
      - name: Analyze with AI
        # Use AI to analyze the failure and suggest fixes
```

## Contributing

When extending the failure monitoring system:

1. Follow the existing pattern for label determination
2. Add new diagnostic context in `_getActionSpecificContext`
3. Ensure sensitive data is sanitized in `_sanitizeActionData`
4. Update tests in `tests/failure-monitoring.test.js`

## Security Considerations

- GitHub tokens are only used for API calls, never logged
- Action data is sanitized to remove sensitive fields
- Local fallback prevents monitoring failures from affecting core functionality
- All logs include only non-sensitive diagnostic information