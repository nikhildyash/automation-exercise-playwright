export interface UserData {
  name: string;
  email: string;
  password: string;
  title: 'Mr' | 'Mrs' | 'Miss';
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
}

export function createUniqueUser(overrides: Partial<UserData> = {}): UserData {
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    name: 'Nikhil QA',
    email: `nikhil.qa.${unique}@example.com`,
    password: 'Playwright@123',
    title: 'Mr',
    birth_date: '15',
    birth_month: '6',
    birth_year: '1997',
    firstname: 'Nikhil',
    lastname: 'Deshmukh',
    company: 'Playwright POC',
    address1: 'Test Street 101',
    address2: 'Automation Area',
    country: 'India',
    zipcode: '411001',
    state: 'Maharashtra',
    city: 'Pune',
    mobile_number: '9876543210',
    ...overrides
  };
}
