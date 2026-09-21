import { test } from '../../fixtures/testFixtures';

test.describe('UI | Login', () => {
  test('SCRUM-5 | Display an error for invalid login credentials', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(`missing.${Date.now()}@example.com`, 'wrong-password');
    await loginPage.expectInvalidCredentials();
  });
});
