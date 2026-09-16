import { test as base } from '@playwright/test';
import { AccountApi } from '../api/accountApi';
import { ProductsApi } from '../api/productsApi';
import { CartPage } from '../pages/cartPage';
import { LoginPage } from '../pages/loginPage';
import { ProductsPage } from '../pages/productsPage';
import { SignupPage } from '../pages/signupPage';

interface FrameworkFixtures {
  accountApi: AccountApi;
  productsApi: ProductsApi;
  loginPage: LoginPage;
  signupPage: SignupPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
}

export const test = base.extend<FrameworkFixtures>({
  page: async ({ page }, use) => {
    await page.route(/(doubleclick|googlesyndication|googleadservices)\.net/, route => route.abort());
    await use(page);
  },
  accountApi: async ({ request }, use) => use(new AccountApi(request)),
  productsApi: async ({ request }, use) => use(new ProductsApi(request)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  signupPage: async ({ page }, use) => use(new SignupPage(page)),
  productsPage: async ({ page }, use) => use(new ProductsPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page))
});

export { expect } from '@playwright/test';
