import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async dismissConsentIfPresent(): Promise<void> {
    const consentButton = this.page.getByRole('button', { name: /consent|accept/i }).first();
    if (await consentButton.isVisible({ timeout: 1_500 }).catch(() => false)) {
      await consentButton.click();
    }
  }
}
