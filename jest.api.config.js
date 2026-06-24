module.exports = {
  testEnvironment: 'node',
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'Trello API Test Report',
        outputPath: './cypress/reports/api/index.html',
        includeFailureMsg: true,
        includeSuiteFailure: true,
      },
    ],
  ],
};
