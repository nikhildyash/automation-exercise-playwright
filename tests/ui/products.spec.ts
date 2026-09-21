import productData from '../../test-data/products.json';
import { expect, test } from '../../fixtures/testFixtures';

test.describe('UI | Products and cart', () => {
  test('SCRUM-6 | Search for a product in the catalog', async ({ productsPage }) => {
    await productsPage.open();
    await productsPage.search(productData.searchTerm);
    await productsPage.expectProductVisible(productData.expectedProduct);

    const names = await productsPage.visibleProductNames();
    expect(names.length).toBeGreaterThan(0);
    expect(names.some(name => name.toLowerCase().includes(productData.searchTerm))).toBeTruthy();
  });

  test('SCRUM-7 | Add a product to the shopping cart', async ({ productsPage, cartPage }) => {
    await productsPage.open();
    await productsPage.addProductToCart(productData.cartProductId);
    await productsPage.viewCart();
    await cartPage.expectProduct(productData.cartProductId, productData.expectedProduct);
  });
});
