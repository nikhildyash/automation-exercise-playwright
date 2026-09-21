import { test, expect } from '@playwright/test';
import { getRegressionTestCases, isJiraConfigured } from '../../api/jiraClient';

test.skip(!isJiraConfigured(), 'Jira secrets are not configured');
 
test('fetch regression test cases from Jira', async () => {
  const result = await getRegressionTestCases();
 
  console.log('Regression Test Cases:');
 
  for (const issue of result.issues) {
    console.log(
      `${issue.key} | ${issue.fields.summary} | ${issue.fields.status.name}`
    );
  }
 
  expect(result.issues.length).toBeGreaterThan(0);
});