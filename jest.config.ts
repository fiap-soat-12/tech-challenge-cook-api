import type { Config } from 'jest';

const config: Config = {
  moduleNameMapper: {
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
  },

  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.module.{ts,js}', // Ignorar arquivos de módulos NestJS
    '!src/**/*.config.{ts,js}', // Ignorar arquivos de configuração da aplicação
    '!src/main.{ts,js}', // Ignorar o arquivo principal
    '!src/**/*.(spec|test).{ts,js}', // Ignorar arquivos de testes
  ],
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['lcov', 'json-summary'],
  testResultsProcessor: 'jest-sonar-reporter',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  verbose: true,
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'Tech Challenge cook api Test Report',
        outputPath: 'coverage/jest-test-report.html',
        includeFailureMsg: true,
        includeConsoleLog: true,
      },
    ],
  ],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.ts'],
};

export default config;
