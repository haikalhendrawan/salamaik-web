/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'html', 'text'],
  modulePathIgnorePatterns: [
    './dist',
    './logs',
    './coverage',
    './node_modules',
    'src/index.ts',
    'src/routes',
    './src'
  ],
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};