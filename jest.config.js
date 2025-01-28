module.exports = {
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['lcov', 'json-summary'],
  testResultsProcessor: 'jest-sonar-reporter',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.module.{ts,js}',
    '!src/main.{ts,js}',
  ],
  reporters: [
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
};
