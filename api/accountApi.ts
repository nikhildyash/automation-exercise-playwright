import { APIRequestContext } from '@playwright/test';
import { accountDetailsResponseSchema, accountMessageResponseSchema } from '../test-data/schemas';
import { ApiEnvelope, parseApiResponse } from './baseApi';
import { UserData } from '../utils/testData';

export interface AccountDetails {
  id: number;
  name: string;
  email: string;
  title: string;
  birth_day: string;
  birth_month: string;
  birth_year: string;
  first_name: string;
  last_name: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
}

export class AccountApi {
  constructor(private readonly request: APIRequestContext) {}

  async create(user: UserData): Promise<ApiEnvelope> {
    const response = await this.request.post('/api/createAccount', { form: { ...user } });
    return parseApiResponse(response, accountMessageResponseSchema);
  }

  async verifyLogin(email: string, password: string): Promise<ApiEnvelope> {
    const response = await this.request.post('/api/verifyLogin', {
      form: { email, password }
    });
    return parseApiResponse(response, accountMessageResponseSchema);
  }

  async getByEmail(email: string): Promise<ApiEnvelope<AccountDetails>> {
    const response = await this.request.get('/api/getUserDetailByEmail', {
      params: { email }
    });
    return parseApiResponse<AccountDetails>(response, accountDetailsResponseSchema);
  }

  async update(user: UserData): Promise<ApiEnvelope> {
    const response = await this.request.put('/api/updateAccount', { form: { ...user } });
    return parseApiResponse(response, accountMessageResponseSchema);
  }

  async delete(email: string, password: string): Promise<ApiEnvelope> {
    const response = await this.request.delete('/api/deleteAccount', {
      form: { email, password }
    });
    return parseApiResponse(response, accountMessageResponseSchema);
  }
}
