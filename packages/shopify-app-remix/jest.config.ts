import type {Config} from 'jest';

import baseConfig from '../../config/tests/jest.config';

const esModules = ['@web3-storage'].join('|');

const config: Config = {
  ...baseConfig,
  projects: [
    {
      displayName: 'shopify-app-remix-react',
      preset: 'ts-jest',
      testMatch: ['**/*.test.ts', '**/*.test.tsx'],
      testEnvironment: 'jsdom',
      testPathIgnorePatterns: ['src/server'],
      transform: {
        '\\.js$': ['babel-jest', {configFile: './babel.config.jest.js'}],
      },
      transformIgnorePatterns: [`node_modules/(?!${esModules})`],
    },
    {
      displayName: 'shopify-app-remix-server-node',
      preset: 'ts-jest',
      testMatch: ['**/*.test.ts', '**/*.test.tsx'],
      setupFilesAfterEnv: [
        ...(baseConfig.setupFilesAfterEnv ?? []),
        '../../packages/shopify-app-remix/src/server/adapters/node/__tests__/setup-jest.ts',
      ],
      testPathIgnorePatterns: ['src/react', 'src/server/adapters/__tests__'],
    },
    {
      displayName: 'shopify-app-remix-server-vercel',
      preset: 'ts-jest',
      testMatch: ['**/*.test.ts', '**/*.test.tsx'],
      setupFilesAfterEnv: [
        ...(baseConfig.setupFilesAfterEnv ?? []),
        '../../packages/shopify-app-remix/src/server/adapters/vercel/__tests__/setup-jest.ts',
      ],
      testPathIgnorePatterns: ['src/react', 'src/server/adapters/__tests__'],
    },
    {
      displayName: 'shopify-app-remix-server-adapters',
      preset: 'ts-jest',
      rootDir: './src/server/adapters',
      testMatch: ['**/*.test.ts', '**/*.test.tsx'],
    },
  ],
};

export default config;
