/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['src/**/*.{js,ts,tsx}', '!**/node_modules/**'],
  roots: ['<rootDir>/src'],
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/src/$1',
    obsidian: '<rootDir>/test/mocks/obsidian.ts',
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
