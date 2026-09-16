import { expect, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class LoginPage extends BasePage {
  private readonly emailInput = this.page.locator('[data-qa="login-email"]');
  private readonly passwordInput = this.page.locator('[data-qa="login-password"]');
  private readonly loginButton = this.page.locator('[data-qa="login-button"]');

  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.page.goto('/login');
    await this.dismissConsentIfPresent();
    await expect(this.page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectInvalidCredentials(): Promise<void> {
    await expect(this.page.getByText('Your email or password is incorrect!')).toBeVisible();
  }

  async expectLoggedInAs(name: string): Promise<void> {
    await expect(this.page.getByText(`Logged in as ${name}`, { exact: false })).toBeVisible();
  }
}
