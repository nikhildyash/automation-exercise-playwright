import { expect, test } from '../../fixtures/testFixtures';
import { createUniqueUser } from '../../utils/testData';

test.describe('API | Account lifecycle', () => {
  test('creates, verifies, updates and deletes an account', async ({ accountApi }) => {
    const user = createUniqueUser();
    let accountCreated = false;

    try {
      const created = await accountApi.create(user);
      expect(created.responseCode).toBe(201);
      expect(created.message).toBe('User created!');
      accountCreated = true;

      const login = await accountApi.verifyLogin(user.email, user.password);
      expect(login.responseCode).toBe(200);
      expect(login.message).toBe('User exists!');

      const details = await accountApi.getByEmail(user.email);
      expect(details.responseCode).toBe(200);
      expect(details.user).toMatchObject({ email: user.email, name: user.name });

      const updatedUser = { ...user, name: 'Nikhil Updated', city: 'Mumbai' };
      const updated = await accountApi.update(updatedUser);
      expect(updated.responseCode).toBe(200);
      expect(updated.message).toBe('User updated!');

      const updatedDetails = await accountApi.getByEmail(user.email);
      expect(updatedDetails.user).toMatchObject({ name: 'Nikhil Updated', city: 'Mumbai' });
    } finally {
      if (accountCreated) {
        const deleted = await accountApi.delete(user.email, user.password);
        expect(deleted.responseCode).toBe(200);
      }
    }
  });
});
