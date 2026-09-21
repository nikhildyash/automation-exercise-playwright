import productData from '../../test-data/products.json';
import { expect, test } from '../../fixtures/testFixtures';

test.describe('API | Products', () => {
  test('SCRUM-8 | Retrieve the product catalog', async ({ productsApi }) => {
    const result = await productsApi.getAllProducts();

    expect(result.responseCode).toBe(200);
    expect(result.products).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 1, name: productData.expectedProduct })
    ]));
  });

  test('SCRUM-9 | Search products by name', async ({ productsApi }) => {
    const result = await productsApi.searchProduct(productData.searchTerm);

    expect(result.responseCode).toBe(200);
    expect(result.products?.length).toBeGreaterThan(0);
    expect(result.products?.some(product =>
      product.name.toLowerCase().includes(productData.searchTerm)
    )).toBeTruthy();
  });

  test('SCRUM-10 | Reject an unsupported HTTP method for the product list', async ({ productsApi }) => {
    const result = await productsApi.postToProductsList();

    expect(result.responseCode).toBe(405);
    expect(result.message).toContain('not supported');
  });
});
