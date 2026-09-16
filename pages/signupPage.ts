import { expect, Page } from '@playwright/test';
import { BasePage } from './basePage';
import { UserData } from '../utils/testData';

export class SignupPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.page.goto('/login');
    await this.dismissConsentIfPresent();
    await expect(this.page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();
  }

  async startSignup(user: UserData): Promise<void> {
    await this.page.locator('[data-qa="signup-name"]').fill(user.name);
    await this.page.locator('[data-qa="signup-email"]').fill(user.email);
    await this.page.locator('[data-qa="signup-button"]').click();
    await expect(this.page.getByText('Enter Account Information')).toBeVisible();
  }

  async completeAccountForm(user: UserData): Promise<void> {
    const genderSelector = user.title === 'Mr' ? '#id_gender1' : '#id_gender2';
    await this.page.locator(genderSelector).check();
    await this.page.locator('#password').fill(user.password);
    await this.page.locator('#days').selectOption(user.birth_date);
    await this.page.locator('#months').selectOption(user.birth_month);
    await this.page.locator('#years').selectOption(user.birth_year);
    await this.page.locator('#newsletter').check();
    await this.page.locator('#optin').check();
    await this.page.locator('#first_name').fill(user.firstname);
    await this.page.locator('#last_name').fill(user.lastname);
    await this.page.locator('#company').fill(user.company);
    await this.page.locator('#address1').fill(user.address1);
    await this.page.locator('#address2').fill(user.address2);
    await this.page.locator('#country').selectOption({ label: user.country });
    await this.page.locator('#state').fill(user.state);
    await this.page.locator('#city').fill(user.city);
    await this.page.locator('#zipcode').fill(user.zipcode);
    await this.page.locator('#mobile_number').fill(user.mobile_number);
    await this.page.locator('[data-qa="create-account"]').click();
  }

  async expectAccountCreated(): Promise<void> {
    await expect(this.page.locator('[data-qa="account-created"]')).toHaveText('Account Created!');
  }
}
