import { expect, test } from '../../fixtures/testFixtures';
import { parseApiResponse } from '../../api/baseApi';
import { productSearchResponseSchema } from '../../test-data/schemas/products.schema';

test.describe('API | Schema validation', () => {
  test('SCRUM-12 | Reject an invalid product-search response schema', async () => {
    const response = {
      url: () => 'https://example.com/api/searchProduct',
      text: async () => JSON.stringify({
        responseCode: 200,
        products: [{ id: 'bad-id', name: 123 }]
      })
    } as any;

    await expect(parseApiResponse(response, productSearchResponseSchema)).rejects.toThrow();
  });
});
