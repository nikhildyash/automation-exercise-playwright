import { expect, test } from '../../fixtures/testFixtures';
import { createUniqueUser } from '../../utils/testData';

test.describe('Hybrid | UI action and API validation', () => {
  test('SCRUM-14 | Create an account through UI and verify it through API', async ({ signupPage, accountApi }) => {
    const user = createUniqueUser();
    let accountCreated = false;

    try {
      await signupPage.open();
      await signupPage.startSignup(user);
      await signupPage.completeAccountForm(user);
      await signupPage.expectAccountCreated();
      accountCreated = true;

      const details = await accountApi.getByEmail(user.email);
      expect(details.responseCode).toBe(200);
      expect(details.user).toMatchObject({
        name: user.name,
        email: user.email,
        first_name: user.firstname,
        last_name: user.lastname,
        city: user.city
      });
    } finally {
      if (accountCreated) {
        await accountApi.delete(user.email, user.password);
      }
    }
  });
});
