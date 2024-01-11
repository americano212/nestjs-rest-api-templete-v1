import type { Config } from 'jest';

import config from '../jest.config';

const jestConfig: Config = {
  ...config,
  rootDir: '.',
  moduleNameMapper: {
    '#(.*)': '<rootDir>/../src/$1',
  },
  modulePaths: ['<rootDir>/../'],
  testMatch: ['**/e2e/**/*.+(e2e-spec|e2e-test).[tj]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/'],
};

export default jestConfig;
