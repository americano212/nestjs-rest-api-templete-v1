import type { Config } from 'jest';

/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
const jestConfig: Config = {
  clearMocks: true,
  coverageDirectory: './coverage',
  coverageProvider: 'v8',
  moduleNameMapper: {
    '#(.*)': '<rootDir>/src/$1',
  },
  preset: 'ts-jest',

  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  modulePaths: ['<rootDir>'],

  testEnvironment: 'node',
  testMatch: ['**/*.+(spec|test).[tj]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/e2e/'],
  testTimeout: 30000,
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        isolatedModules: true,
      },
    ],
  },
};

export default jestConfig;
