import productData from '../../test-data/products.json';
import { expect, test } from '../../fixtures/testFixtures';

test.describe('API | Products', () => {
  test('gets the product catalog', async ({ productsApi }) => {
    const result = await productsApi.getAllProducts();

    expect(result.responseCode).toBe(200);
    expect(result.products).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 1, name: productData.expectedProduct })
    ]));
  });

  test('searches products', async ({ productsApi }) => {
    const result = await productsApi.searchProduct(productData.searchTerm);

    expect(result.responseCode).toBe(200);
    expect(result.products?.length).toBeGreaterThan(0);
    expect(result.products?.some(product =>
      product.name.toLowerCase().includes(productData.searchTerm)
    )).toBeTruthy();
  });

  test('rejects an unsupported method', async ({ productsApi }) => {
    const result = await productsApi.postToProductsList();

    expect(result.responseCode).toBe(405);
    expect(result.message).toContain('not supported');
  });
});
