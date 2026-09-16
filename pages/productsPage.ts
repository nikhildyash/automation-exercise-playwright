import { expect, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class ProductsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.page.goto('/products');
    await this.dismissConsentIfPresent();
    await expect(this.page.getByRole('heading', { name: 'All Products' })).toBeVisible();
  }

  async search(term: string): Promise<void> {
    await this.page.locator('#search_product').fill(term);
    await this.page.locator('#submit_search').click();
    await expect(this.page.getByRole('heading', { name: 'Searched Products' })).toBeVisible();
  }

  async expectProductVisible(productName: string): Promise<void> {
    await expect(this.page.locator('.productinfo p', { hasText: productName }).first()).toBeVisible();
  }

  async visibleProductNames(): Promise<string[]> {
    return this.page.locator('.productinfo p').allTextContents();
  }

  async addProductToCart(productId: number): Promise<void> {
    const addButton = this.page.locator(`.productinfo a[data-product-id="${productId}"]`).first();
    await addButton.scrollIntoViewIfNeeded();
    await addButton.click();
    await expect(this.page.getByText('Your product has been added to cart.')).toBeVisible();
  }

  async viewCart(): Promise<void> {
    await this.page.getByRole('link', { name: 'View Cart' }).click();
  }
}
