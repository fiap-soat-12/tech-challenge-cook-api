module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text', 'text-summary', 'html', 'json-summary'],
  testResultsProcessor: 'jest-sonar-reporter',
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'Test Report',
        outputPath: './reports/test-report.html',
        includeFailureMsg: true,
        includeConsoleLog: true,
      },
    ],
  ],
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  testEnvironment: 'node',
};
