import { test } from '../../fixtures/testFixtures';

test.describe('UI | Login', () => {
  test('shows an error for invalid credentials', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(`missing.${Date.now()}@example.com`, 'wrong-password');
    await loginPage.expectInvalidCredentials();
  });
});
