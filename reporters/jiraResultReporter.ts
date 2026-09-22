import type {
  Reporter,
  TestCase,
  TestResult,
  FullResult,
} from '@playwright/test/reporter';
import fs from 'fs';
 
type JiraTestResult = {
  jiraKey: string;
  title: string;
  status: string;
  executedAt: string;
};
 
class JiraResultReporter implements Reporter {
  private results: JiraTestResult[] = [];
 
  onTestEnd(test: TestCase, result: TestResult) {
    const match = test.title.match(/SCRUM-\d+/);
 
    if (!match) {
      return;
    }
 
    this.results.push({
      jiraKey: match[0],
      title: test.title,
      status: result.status,
      executedAt: result.startTime.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
        hour12: false,
      }),
    });
  }
 
  onEnd(result: FullResult) {
    fs.writeFileSync(
      'jira-results.json',
      JSON.stringify(
        {
          runStatus: result.status,
          tests: this.results,
        },
        null,
        2
      )
    );
  }
}
 
export default JiraResultReporter;