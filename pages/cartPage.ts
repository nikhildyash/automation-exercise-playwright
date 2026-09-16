import { expect, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async expectProduct(productId: number, productName: string, quantity = 1): Promise<void> {
    const row = this.page.locator(`#product-${productId}`);
    await expect(row).toBeVisible();
    await expect(row.locator('.cart_description')).toContainText(productName);
    await expect(row.locator('.cart_quantity')).toHaveText(String(quantity));
  }
}
