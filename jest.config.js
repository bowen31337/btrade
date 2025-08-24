export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.js'],
  moduleFileExtensions: ['js', 'json'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.test.js',
    '<rootDir>/src/**/*.test.js'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/src/components/__tests__/__mocks__/'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/main.js',
    '!src/**/*.test.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  transform: {
    '^.+\.js$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(lightweight-charts)/)',
  ],
  moduleNameMapper: {
    '^lightweight-charts$': '<rootDir>/src/components/__tests__/__mocks__/lightweight-charts.js'
  }
};