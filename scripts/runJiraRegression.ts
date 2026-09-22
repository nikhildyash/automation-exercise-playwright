import { spawnSync } from 'child_process';
import fs from 'fs';
 
import {
  getRegressionTestCases,
  createRegressionRun,
  addCommentToJiraIssue,
} from '../api/jiraClient';
 
async function runRegression() {
  try {
    console.log('Fetching regression test cases from Jira...');
 
    const jiraResult = await getRegressionTestCases();
 
    const jiraKeys = jiraResult.issues.map(
      (issue: any) => issue.key
    );
 
    if (jiraKeys.length === 0) {
      console.log(
        'No automated regression test cases found in Jira.'
      );
      return;
    }
 
    console.log('\nJira regression test cases:');
 
    jiraKeys.forEach((key: string) => {
      console.log(`- ${key}`);
    });
 
    // -------------------------------------------------
    // Create Jira Regression Run
    // -------------------------------------------------
 
    console.log('\nCreating Jira Regression Run...');
 
    const regressionRun = await createRegressionRun();
 
    console.log(
      `Regression Run created: ${regressionRun.key}`
    );
 
    // -------------------------------------------------
    // Build grep pattern from Jira IDs
    // -------------------------------------------------
 
    const grepPattern = jiraKeys.join('|');
 
    console.log('\nRunning Playwright tests...');
    console.log(`Pattern: ${grepPattern}`);
 
    const resultFile = 'jira-results.json';
 
    // Remove old results before starting new regression
    if (fs.existsSync(resultFile)) {
      fs.unlinkSync(resultFile);
    }
 
    // -------------------------------------------------
    // Execute Playwright tests
    // -------------------------------------------------
 
    const execution = spawnSync(
      process.execPath,
      [
        require.resolve('@playwright/test/cli'),
        'test',
        '--grep',
        grepPattern,
        '--reporter=list,./reporters/jiraResultReporter.ts',
      ],
      { stdio: 'inherit' }
    );
 
    if (execution.error) {
      console.error(
        'Playwright execution error:',
        execution.error
      );
    }
 
    const exitCode = execution.status ?? 1;
 
    console.log(
      `\nPlaywright exit code: ${exitCode}`
    );
 
    // -------------------------------------------------
    // Validate Jira result file
    // -------------------------------------------------
 
    if (!fs.existsSync(resultFile)) {
      const failureComment = `
Playwright Regression Execution
 
Regression Run: ${regressionRun.key}
 
Status: EXECUTION ERROR
 
jira-results.json was not generated.
 
Playwright Exit Code: ${exitCode}
`;
 
      await addCommentToJiraIssue(
        regressionRun.key,
        failureComment
      );
 
      throw new Error(
        'jira-results.json was not generated.'
      );
    }
 
    // -------------------------------------------------
    // Read Playwright results
    // -------------------------------------------------
 
    const executionResults = JSON.parse(
      fs.readFileSync(resultFile, 'utf-8')
    );
 
    const tests = executionResults.tests ?? [];
 
    // -------------------------------------------------
    // Calculate summary
    // -------------------------------------------------
 
    const passed = tests.filter(
      (test: any) => test.status === 'passed'
    ).length;
 
    const failed = tests.filter(
      (test: any) => test.status === 'failed'
    ).length;
 
    const skipped = tests.filter(
      (test: any) => test.status === 'skipped'
    ).length;
 
    const timedOut = tests.filter(
      (test: any) => test.status === 'timedOut'
    ).length;
 
    const interrupted = tests.filter(
      (test: any) => test.status === 'interrupted'
    ).length;
 
    // -------------------------------------------------
    // Update individual Jira Test Cases
    // -------------------------------------------------
 
    console.log(
      '\nUpdating individual Jira test cases...'
    );
 
    for (const testResult of tests) {
      if (!testResult.jiraKey) {
        console.log(
          `Skipping Jira update because test has no Jira ID: ${testResult.title}`
        );
 
        continue;
      }
 
      const individualComment = `
Automation Execution Result
 
Regression Run: ${regressionRun.key}
 
Result: ${testResult.status.toUpperCase()}
 
Executed At (IST): ${testResult.executedAt}

Test:
${testResult.title}
`;
 
      try {
        await addCommentToJiraIssue(
          testResult.jiraKey,
          individualComment
        );
 
        console.log(
          `${testResult.jiraKey} → ${testResult.status.toUpperCase()}`
        );
      } catch (error) {
        console.error(
          `Failed to update ${testResult.jiraKey}`,
          error
        );
      }
    }
 
    // -------------------------------------------------
    // Build detailed execution results
    // -------------------------------------------------
 
    const details = tests
      .map((testResult: any) => {
        return `${testResult.jiraKey} → ${testResult.status.toUpperCase()}`;
      })
      .join('\n');
 
    // -------------------------------------------------
    // Prepare regression run summary
    // -------------------------------------------------
 
    const regressionComment = `
Playwright Regression Execution
 
Regression Run: ${regressionRun.key}
 
Total Tests: ${tests.length}
 
Passed: ${passed}
Failed: ${failed}
Skipped: ${skipped}
Timed Out: ${timedOut}
Interrupted: ${interrupted}
 
Overall Status:
${executionResults.runStatus?.toUpperCase() ?? 'UNKNOWN'}
 
Test Results:
 
${details}
`;
 
    // -------------------------------------------------
    // Update Regression Run
    // -------------------------------------------------
 
    console.log(
      '\nPosting regression summary to Jira...'
    );
 
    await addCommentToJiraIssue(
      regressionRun.key,
      regressionComment
    );
 
    console.log(
      `Regression summary posted successfully to ${regressionRun.key}`
    );
 
    // -------------------------------------------------
    // Console summary
    // -------------------------------------------------
 
    console.log('\n================================');
    console.log('Regression Execution Summary');
    console.log('================================');
 
    console.log(
      `Regression Run : ${regressionRun.key}`
    );
 
    console.log(`Total          : ${tests.length}`);
    console.log(`Passed         : ${passed}`);
    console.log(`Failed         : ${failed}`);
    console.log(`Skipped        : ${skipped}`);
    console.log(`Timed Out      : ${timedOut}`);
    console.log(`Interrupted    : ${interrupted}`);
 
    console.log('================================');
 
    // -------------------------------------------------
    // Exit with Playwright result
    // -------------------------------------------------
 
    process.exit(exitCode);
 
  } catch (error) {
    console.error(
      '\nJira Regression execution failed:'
    );
 
    console.error(error);
 
    process.exit(1);
  }
}
 
runRegression();