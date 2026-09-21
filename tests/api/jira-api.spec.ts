import { test, expect } from '@playwright/test';
import { getJiraIssue } from '../../api/jiraClient';
 
test('verify Jira connection', async () => {
  const issue = await getJiraIssue('SCRUM-5');
 
  console.log('Jira Key:', issue.key);
  console.log('Summary:', issue.fields.summary);
  console.log('Status:', issue.fields.status.name);
  console.log('Labels:', issue.fields.labels);
 
  expect(issue.key).toBe('SCRUM-5');
});
