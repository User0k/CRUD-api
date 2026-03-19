import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  verbose: true,
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};

export default config;
