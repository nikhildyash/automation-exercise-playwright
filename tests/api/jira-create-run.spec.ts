import { test, expect } from '@playwright/test';
import { createRegressionRun } from '../../api/jiraClient';
 
test('create regression run in Jira', async () => {
 
  const run = await createRegressionRun();
 
  console.log(
    'Regression Run created:',
    run.key
  );
 
  expect(run.key).toBeTruthy();
});