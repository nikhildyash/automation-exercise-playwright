import { test, expect } from '@playwright/test';
import { createRegressionRun, isJiraConfigured } from '../../api/jiraClient';

test.skip(!isJiraConfigured(), 'Jira secrets are not configured');
 
test('create regression run in Jira', async () => {
 
  const run = await createRegressionRun();
 
  console.log(
    'Regression Run created:',
    run.key
  );
 
  expect(run.key).toBeTruthy();
});