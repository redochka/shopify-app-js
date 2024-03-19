import {ShopifyError, shopifyApi} from '@shopify/shopify-api';

import {
  shopifyApp,
  LATEST_API_VERSION as APP_LATEST_API_VERSION,
  LogSeverity,
  DeliveryMethod,
  BillingInterval,
  AppDistribution,
  ApiVersion,
} from '../index';
import {testConfig} from '../__test-helpers';

const {shopifyApi: originalShopifyApi} = jest.requireActual(
  '@shopify/shopify-api',
);
jest.mock('@shopify/shopify-api', () => ({
  ...jest.requireActual('@shopify/shopify-api'),
  shopifyApi: jest.fn(),
}));

describe('shopifyApp', () => {
  /* eslint-disable no-process-env */
  const oldEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    (shopifyApi as jest.Mock).mockReset();
    (shopifyApi as jest.Mock).mockImplementation(originalShopifyApi);
    process.env = {...oldEnv};
  });

  afterAll(() => {
    process.env = oldEnv;
  });
  /* eslint-enable no-process-env */

  it('can create shopify object', () => {
    // GIVEN
    const shopify = shopifyApp(testConfig());

    // THEN
    expect(shopify).toBeDefined();
  });

  it('has login function when distribution is not ShopifyAdmin', () => {
    // GIVEN
    const shopify = shopifyApp(testConfig());

    // THEN
    expect(shopify.login).toBeDefined();
  });

  it('does not have login function when distribution is ShopifyAdmin', () => {
    // GIVEN
    const shopify = shopifyApp(
      testConfig({
        distribution: AppDistribution.ShopifyAdmin,
        adminApiAccessToken: 'dummy_token',
      }),
    );

    // THEN
    expect(shopify).not.toHaveProperty('login');
  });

  it('fails with an invalid config', () => {
    expect(() => shopifyApp({} as any)).toThrowError(ShopifyError);
  });

  it("fixes the port if it's not set", () => {
    // GIVEN
    // eslint-disable-next-line no-process-env
    process.env.PORT = '1234';

    // WHEN
    shopifyApp(testConfig({appUrl: 'http://localhost'}));

    // THEN
    expect(shopifyApi).toHaveBeenCalledWith(
      expect.objectContaining({
        appUrl: 'http://localhost:1234',
      }),
    );
  });

  it('applies user agent prefix', () => {
    // GIVEN
    const config = testConfig({userAgentPrefix: 'test'});

    // WHEN
    shopifyApp(config);

    // THEN
    const {userAgentPrefix} = (shopifyApi as jest.Mock).mock.calls[0][0];

    expect(userAgentPrefix).toMatch(
      /^test \| Shopify Remix Library v[0-9]+\.[0-9]+\.[0-9]+(-rc.[0-9]+)?$/,
    );
  });

  it('properly re-exports required @shopify/shopify-api imports', () => {
    // This test doesn't actually test anything, but it's here to make sure that we're actually importing the values
    const imports = [
      APP_LATEST_API_VERSION,
      LogSeverity,
      DeliveryMethod,
      BillingInterval,
      ApiVersion,
    ];

    expect(imports).not.toContain(undefined);
  });

  it('fails if no session storage is given', () => {
    // GIVEN
    const config = testConfig({sessionStorage: undefined});
    delete (config as any).sessionStorage;

    // THEN
    expect(() => shopifyApp(config as any)).toThrowError(ShopifyError);
  });
});
