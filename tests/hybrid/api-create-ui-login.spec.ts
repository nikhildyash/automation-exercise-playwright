import { expect, test } from '../../fixtures/testFixtures';
import { createUniqueUser } from '../../utils/testData';

test.describe('Hybrid | API setup and UI validation', () => {
  test('creates a user by API and logs in through the UI', async ({ accountApi, loginPage }) => {
    const user = createUniqueUser();
    let accountCreated = false;

    try {
      const created = await accountApi.create(user);
      expect(created.responseCode).toBe(201);
      accountCreated = true;

      await loginPage.open();
      await loginPage.login(user.email, user.password);
      await loginPage.expectLoggedInAs(user.name);
    } finally {
      if (accountCreated) {
        await accountApi.delete(user.email, user.password);
      }
    }
  });
});
