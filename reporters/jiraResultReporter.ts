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