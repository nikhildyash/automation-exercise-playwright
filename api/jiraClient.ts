import 'dotenv/config';
 
const cloudId = process.env.JIRA_CLOUD_ID;
const token = process.env.JIRA_API_TOKEN;
 
if (!cloudId) {
  throw new Error('JIRA_CLOUD_ID is missing from .env');
}
 
if (!token) {
  throw new Error('JIRA_API_TOKEN is missing from .env');
}
 
const jiraBaseUrl = `https://api.atlassian.com/ex/jira/${cloudId}`;
 
export async function getJiraIssue(issueKey: string) {
  const response = await fetch(
    `${jiraBaseUrl}/rest/api/3/issue/${issueKey}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }
  );
 
  if (!response.ok) {
    const errorBody = await response.text();
 
    throw new Error(
      `Jira API failed. Status: ${response.status}\n${errorBody}`
    );
  }
 
  return response.json();
}

export async function getRegressionTestCases() {
  const jql =
    'project = SCRUM AND issuetype = "Test Case" AND labels = Regression AND labels = automated';
 
  const url =
    `${jiraBaseUrl}/rest/api/3/search/jql` +
    `?jql=${encodeURIComponent(jql)}` +
    `&fields=summary,status,labels`;
 
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
 
  if (!response.ok) {
    const errorBody = await response.text();
 
    throw new Error(
      `Jira search failed. Status: ${response.status}\n${errorBody}`
    );
  }
 
  return response.json();
}

export async function createRegressionRun() {
  const projectKey = process.env.JIRA_PROJECT_KEY;
 
  if (!projectKey) {
    throw new Error('JIRA_PROJECT_KEY is missing from .env');
  }
 
  const now = new Date();
 
  const runName =
    `Regression Run - ${now.toLocaleString('en-IN')}`;
 
  const response = await fetch(
    `${jiraBaseUrl}/rest/api/3/issue`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          project: {
            key: projectKey,
          },
 
          summary: runName,
 
          issuetype: {
            name: 'Task',
          },
 
          labels: [
            'regression-run',
            'automation',
          ],
 
          description: {
            type: 'doc',
            version: 1,
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text:
                      'Automated Playwright regression execution.',
                  },
                ],
              },
            ],
          },
        },
      }),
    }
  );
 
  if (!response.ok) {
    const error = await response.text();
 
    throw new Error(
      `Unable to create regression run: ${response.status}\n${error}`
    );
  }
 
  return response.json();
}

export async function addCommentToJiraIssue(
  issueKey: string,
  comment: string
) {
  const response = await fetch(
    `${jiraBaseUrl}/rest/api/3/issue/${issueKey}/comment`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
 
      body: JSON.stringify({
        body: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: comment,
                },
              ],
            },
          ],
        },
      }),
    }
  );
 
  if (!response.ok) {
    const error = await response.text();
 
    throw new Error(
      `Failed to add Jira comment: ${response.status}\n${error}`
    );
  }
 
  return response.json();
}