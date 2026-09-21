# Jira Test Cases

## Framework Summary

This project automates the Automation Exercise public test application using Playwright and TypeScript.

- **UI layer:** Page Object Model classes for login, signup, products, and cart workflows.
- **API layer:** Reusable `APIRequestContext` clients for products and account endpoints.
- **Hybrid layer:** Creates test data through one interface and validates it through the other interface.
- **Test data:** Product data is stored in `test-data/products.json`. Account data is generated uniquely at runtime.
- **Validation:** UI assertions validate headings, messages, product rows, and logged-in state. API assertions validate the JSON `responseCode`, messages, returned objects, and Zod schemas.
- **Cleanup:** Account tests delete created users in a `finally` block to avoid leaving shared-environment data behind.

## Common Preconditions

1. The Automation Exercise environment is available at `https://automationexercise.com`, or `BASE_URL` is configured for the target environment.
2. The test user can access the public application and its API.
3. For account cases, use a newly generated email address for every execution.
4. API cases must interpret the JSON `responseCode`; the public API may return HTTP 200 for an application-level error.

## UI Test Cases

### UI-001: Display an error for invalid login credentials

**Type:** UI / Negative

**Preconditions:** The login page is available. The email address does not belong to a valid account.

**Test data:**

- Email: `missing.<unique-value>@example.com`
- Password: `wrong-password`

**Steps and expected results:**

| # | Action | Expected result |
|---|---|---|
| 1 | Open `/login`. | The **Login to your account** section is visible. |
| 2 | Enter the unique invalid email address in the email field. | The email value is accepted. |
| 3 | Enter `wrong-password` in the password field. | The password value is accepted. |
| 4 | Select **Login**. | The login request is submitted and the user is not authenticated. |
| 5 | Review the login message. | **Your email or password is incorrect!** is displayed. |

**Cleanup:** None required.

### UI-002: Search for a product in the catalog

**Type:** UI / Functional

**Preconditions:** The products page is available.

**Test data:** Search term `top`; expected product `Blue Top`.

**Steps and expected results:**

| # | Action | Expected result |
|---|---|---|
| 1 | Open `/products`. | The **All Products** heading is visible. |
| 2 | Enter `top` in the product search field. | The search term is entered. |
| 3 | Select the search button. | The **Searched Products** heading is visible. |
| 4 | Review the filtered product list. | At least one product is displayed. |
| 5 | Check the displayed product names. | The list contains a product name containing `top` (case-insensitive), including `Blue Top`. |

**Cleanup:** None required.

### UI-003: Add a product to the shopping cart

**Type:** UI / Functional

**Preconditions:** The products page is available and product ID `1` is present.

**Test data:** Product ID `1`; expected product `Blue Top`.

**Steps and expected results:**

| # | Action | Expected result |
|---|---|---|
| 1 | Open `/products`. | The **All Products** heading is visible. |
| 2 | Select **Add to cart** for product ID `1`. | **Your product has been added to cart.** is displayed. |
| 3 | Select **View Cart**. | The cart page opens. |
| 4 | Locate the row for product ID `1`. | The product row is visible. |
| 5 | Review the product description and quantity. | The row contains `Blue Top` and the quantity is `1`. |

**Cleanup:** The cart is isolated to the browser context and no account cleanup is required.

## API Test Cases

### API-001: Retrieve the product catalog

**Type:** API / Functional

**Endpoint:** `GET /api/productsList`

**Preconditions:** The API is available.

**Steps and expected results:**

| # | Action | Expected result |
|---|---|---|
| 1 | Send a `GET` request to `/api/productsList`. | A JSON response is returned and passes the products-list schema. |
| 2 | Read the JSON `responseCode`. | `responseCode` equals `200`. |
| 3 | Inspect the `products` collection. | The collection contains a product with ID `1` and name `Blue Top`. |

**Cleanup:** None required.

### API-002: Search products by name

**Type:** API / Functional

**Endpoint:** `POST /api/searchProduct`

**Preconditions:** The API is available.

**Test data:** Form field `search_product=top`.

**Steps and expected results:**

| # | Action | Expected result |
|---|---|---|
| 1 | Send a `POST` request to `/api/searchProduct` with form field `search_product` set to `top`. | A JSON response is returned and passes the product-search schema. |
| 2 | Read the JSON `responseCode`. | `responseCode` equals `200`. |
| 3 | Inspect the `products` collection. | At least one product is returned. |
| 4 | Check returned product names. | At least one returned name contains `top` (case-insensitive). |

**Cleanup:** None required.

### API-003: Reject an unsupported HTTP method for the product list

**Type:** API / Negative

**Endpoint:** `POST /api/productsList`

**Preconditions:** The API is available.

**Steps and expected results:**

| # | Action | Expected result |
|---|---|---|
| 1 | Send a `POST` request to `/api/productsList`. | A JSON response is returned. |
| 2 | Read the JSON `responseCode`. | `responseCode` equals `405`. |
| 3 | Read the response message. | The message indicates that the method is not supported. |

**Cleanup:** None required.

### API-004: Validate the complete account lifecycle

**Type:** API / End-to-end lifecycle

**Endpoints:** `POST /api/createAccount`, `POST /api/verifyLogin`, `GET /api/getUserDetailByEmail`, `PUT /api/updateAccount`, `DELETE /api/deleteAccount`

**Preconditions:** The API is available. A unique user email is generated for this execution.

**Test data:** A generated user with name `Nikhil QA`, password `Playwright@123`, and the default profile/address data from `utils/testData.ts`.

**Steps and expected results:**

| # | Action | Expected result |
|---|---|---|
| 1 | Send `POST /api/createAccount` with the user fields as form data. | `responseCode` is `201` and the message is **User created!**. |
| 2 | Send `POST /api/verifyLogin` with the generated email and password. | `responseCode` is `200` and the message is **User exists!**. |
| 3 | Send `GET /api/getUserDetailByEmail` with the generated email. | `responseCode` is `200`; returned email and name match the created user. |
| 4 | Send `PUT /api/updateAccount` with the same user and updated name `Nikhil Updated` and city `Mumbai`. | `responseCode` is `200` and the message is **User updated!**. |
| 5 | Send `GET /api/getUserDetailByEmail` again. | Returned name is `Nikhil Updated` and city is `Mumbai`. |
| 6 | Send `DELETE /api/deleteAccount` with the generated email and password. | `responseCode` is `200`; the created account is removed. |

**Cleanup:** Always execute the delete request when account creation succeeds, including when a later step fails.

### API-005: Reject an invalid product-search response schema

**Type:** API / Contract validation / Negative

**Preconditions:** The response parser and product-search Zod schema are available.

**Test data:** A response body containing `responseCode: 200` but an invalid product with `id: "bad-id"` and `name: 123`.

**Steps and expected results:**

| # | Action | Expected result |
|---|---|---|
| 1 | Pass the invalid JSON response to the API response parser with the product-search schema. | Schema validation is executed. |
| 2 | Observe the parser result. | The parser rejects the response and throws a schema-validation error; invalid product field types are not accepted. |

**Cleanup:** None required.

## Hybrid Test Cases

### HYB-001: Create an account through API and log in through the UI

**Type:** Hybrid / API setup + UI validation

**Preconditions:** The API and login page are available. A unique user email is generated.

**Steps and expected results:**

| # | Action | Expected result |
|---|---|---|
| 1 | Send `POST /api/createAccount` with the generated user as form data. | `responseCode` is `201`; the account is available for login. |
| 2 | Open `/login` in a browser. | The **Login to your account** section is visible. |
| 3 | Enter the generated email and password. | The credentials are accepted. |
| 4 | Select **Login**. | The user is authenticated. |
| 5 | Review the account banner. | **Logged in as Nikhil QA** is visible, using the generated user name. |
| 6 | Delete the account through `DELETE /api/deleteAccount`. | The temporary account is removed. |

**Cleanup:** Always delete the account after the UI assertion when account creation succeeds.

### HYB-002: Create an account through UI and verify it through API

**Type:** Hybrid / UI setup + API validation

**Preconditions:** The login/signup page and account API are available. A unique user email is generated.

**Steps and expected results:**

| # | Action | Expected result |
|---|---|---|
| 1 | Open `/login`. | The **New User Signup!** section is visible. |
| 2 | Enter the generated name and email, then select **Signup**. | The **Enter Account Information** section is displayed. |
| 3 | Complete the account form with the generated title, password, date of birth, newsletter/offer preferences, name, company, address, country, state, city, ZIP code, and mobile number. | All supplied values are accepted. |
| 4 | Select **Create Account**. | **Account Created!** is displayed. |
| 5 | Send `GET /api/getUserDetailByEmail` with the generated email. | `responseCode` is `200`. |
| 6 | Compare the API user details with the submitted data. | Name, email, first name, last name, and city match the values entered through the UI. |
| 7 | Delete the account through `DELETE /api/deleteAccount`. | The temporary account is removed. |

**Cleanup:** Always delete the account after successful UI creation, including when API verification fails.

## Traceability Matrix

| Jira ID | Automation spec | Layer | Primary coverage |
|---|---|---|---|
| UI-001 | `tests/ui/login.spec.ts` | UI | Invalid login validation |
| UI-002 | `tests/ui/products.spec.ts` | UI | Product search |
| UI-003 | `tests/ui/products.spec.ts` | UI | Add product to cart |
| API-001 | `tests/api/products.api.spec.ts` | API | Product catalog retrieval |
| API-002 | `tests/api/products.api.spec.ts` | API | Product search |
| API-003 | `tests/api/products.api.spec.ts` | API | Unsupported method handling |
| API-004 | `tests/api/account.api.spec.ts` | API | Account create, login verification, read, update, delete |
| API-005 | `tests/api/schema-validation.spec.ts` | API | Response contract validation |
| HYB-001 | `tests/hybrid/api-create-ui-login.spec.ts` | Hybrid | API account setup and UI login |
| HYB-002 | `tests/hybrid/ui-create-api-verify.spec.ts` | Hybrid | UI account setup and API verification |