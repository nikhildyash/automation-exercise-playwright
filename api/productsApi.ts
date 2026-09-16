import { APIRequestContext } from '@playwright/test';
import { brandsListResponseSchema, productSearchResponseSchema, productsListResponseSchema } from '../test-data/schemas';
import { ApiEnvelope, parseApiResponse } from './baseApi';

export interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: { usertype: { usertype: string }; category: string };
}

export class ProductsApi {
  constructor(private readonly request: APIRequestContext) {}

  async getAllProducts(): Promise<ApiEnvelope<Product[]>> {
    const response = await this.request.get('/api/productsList');
    return parseApiResponse<Product[]>(response, productsListResponseSchema);
  }

  async getAllBrands(): Promise<ApiEnvelope<unknown[]>> {
    const response = await this.request.get('/api/brandsList');
    return parseApiResponse<unknown[]>(response, brandsListResponseSchema);
  }

  async searchProduct(searchTerm: string): Promise<ApiEnvelope<Product[]>> {
    const response = await this.request.post('/api/searchProduct', {
      form: { search_product: searchTerm }
    });
    return parseApiResponse<Product[]>(response, productSearchResponseSchema);
  }

  async postToProductsList(): Promise<ApiEnvelope> {
    const response = await this.request.post('/api/productsList');
    return parseApiResponse(response);
  }
}
